class AdminController < ApplicationController
  #include CookieDetection
  layout 'admin', :except => [:show]
  layout 'application', :only => [:show]

  prepend_before_filter :set_scope_parameters
  
  before_filter :authenticate_user!, :except => [:show,:public_index,:rss,:cookie_test]
  before_filter :handle_preview, :only => [:show]
  before_filter :set_pagination, :only => [:index]

  # Pagination
  class_attribute :items_per_page
  self.items_per_page = 20

  def show_all
    self.items_per_page = 20000
  end

  def show_default
    self.items_per_page = 20
  end

  def set_pagination
    if params.has_key? :per_page
      if params[:per_page] == 'all'
        self.show_all
      elsif params[:per_page] == 'default'
        self.show_default
      elsif params[:per_page].to_i > 0
        self.items_per_page = params[:per_page].to_i
      end
    elsif self.items_per_page.blank?
      self.show_default
    end
  end
  # view folder

  # Any missed routes will attempt to find their static [path].html.haml equivalent, as if browsing a static site. 
  # If not found, [path]/index.html.haml will be checked
  def static_routing
    respond_to do |format|
      path = (params.has_key? :path) ? params[:path] : ''
      if File.exists?(Rails.root.to_s + '/app/views/admin/' + path.to_s + '.html.haml')
        logger.debug('AdminController.static_routing looking for ' + Rails.root.to_s + '/app/views/admin/' + path + '.html.haml')
        format.html { render '/admin/' + path } 
      elsif File.exists?(Rails.root.to_s + '/app/views/admin/' + path + '/index.html.haml')
        logger.debug('AdminController.static_routing looking for ' + Rails.root.to_s + '/app/views/admin/' + path + '/index.html.haml')
        format.html { render ('/admin/' + path + '/index').gsub('//','/')}
      else
        format.html { render '/admin/404', :locals => { :root => Rails.root.to_s, :path => '/app/views/admin/', :file => path }}
      end  
      #catch folder names here by providing the index.html.haml response, maybe by seeing if what we are about to render exists...
    end
  end 

  def admin_index
    respond_to do |format|
      format.html { render '/admin/index' } # index.html.erb
    end
  end

  

  #
  # Actions useable by most admin subcontrollers
  #

  # GET /:controller_name
  def index
    @target_view = 'index' unless defined? @target_view

    if @current_model
      @item = @current_model.new unless defined? @item # for quick-add form
      search_params = params[:search_params].gsub(/\\/, '\&\&').gsub(/'/, "''")  unless params[:search_params].blank?
      @items = @current_model.search(search_params, params[:filter_by], params[:filter_params], params[:sort_by], params[:sort_order], params[:page], self.items_per_page) unless defined? @items
      @count = @current_model.all.count unless defined? @count # for results info

      set_order_variables
   end

    respond_to do |format|
      format.html { render @current_admin_view_folder + '/' + @target_view } 
      format.js { render 'admin/assets/after_search', :locals => { :search_params => params[:search_params] } }
    end
  end


  # GET /:controller_name/1
  def show
    if params[:id] == 'index'
      respond_to do |format|
        format.html { redirect_to ('/' + @current_admin_view_folder), :notice => flash[:notice], :alert => flash[:alert]}
      end
    else
      @item = @current_model.find(params[:id]) if params.has_key? :id
      logger.debug '@item: ' + @item.to_s

      if defined? self.PUBLIC_VIEW_PATH and self.PUBLIC_VIEW_PATH(@item).present?
        respond_to do |format|
          format.html { redirect_to self.PUBLIC_VIEW_PATH(@item) }
        end
      else      
        @target_view = 'show' unless defined? @target_view
        respond_to do |format|
          format.html { render @current_admin_view_folder + '/' + @target_view } 
        end
      end
    end
  end

  def handle_preview
    # Create item from form if this is ajax submit
    if request.xhr? 
      @is_preview = true # the wrapper may use this to not include jquery, for example
      @preview_id = params[:id] ? params[:id] : nil
      # Remove any empty file upload parameters - will be @current_model.FILE_UPLOAD_FIELDS after refactor
      if defined? self.FILE_UPLOAD_FIELDS
        query_fields = self.FILE_UPLOAD_FIELDS
        # keep an array of just the blank file upload fields
        query_fields.keep_if { |fieldname| 
          params[controller_name.singularize][fieldname].blank? 
        }# unless params[:id] == 'new'
        # query the db for existing file upload data 
        saved_data_object = @current_model.find(params[:id]) unless params[:id] == 'new'
        # for each missing field, delete the request parameter so paperclip does not choke
        query_fields.each do |fieldname|
          # deleting params
          params[controller_name.singularize].delete(fieldname.to_sym)
          unless params[:id] == 'new'
            # resetting param from db data
            # BERGEN why did I ever do this first one? it's breaking custom header and i can't understand why i would pass in :id/file_name for file_name
            #params[controller_name.singularize][fieldname + '_file_name'] = params[:id].to_s + '/' + saved_data_object.instance_eval(fieldname + '_file_name').to_s if saved_data_object.instance_eval(fieldname + '_file_name').present?
            params[controller_name.singularize][fieldname + '_file_name'] = saved_data_object.instance_eval(fieldname + '_file_name').to_s if saved_data_object.instance_eval(fieldname + '_file_name').present?
          end
        end
      end


      # defaults
      params[controller_name.singularize]['created_at'] = DateTime.now
      params[controller_name.singularize]['updated_at'] = DateTime.now

      # create the item from our form post
      @item = @current_model.new(params[controller_name.singularize]) unless defined? @item
      @item.activate # just set status = 1, russ likes this word, though

      # BERGEN: ATTEMPT AT SHOWING NEW FILE UPLOADS IN PREVIEW
      # ###
      # # In order to get contents of the POST request with the photo,
      # # you need to read contents of request
      # ajax_upload = true #params[:image_main].is_a?(String)
      # logger.debug('ajax_upload: ' + ajax_upload.to_s)
      # file_name = ajax_upload ? params[:file] : params[:file].original_filename
      # logger.debug('file_name: ' + file_name.to_s)
      # extension = file_name.split('.').last
      # logger.debug('extension: ' + extension.to_s)

      # # # We have to create a temp file which is going to be used by Paperclip for
      # # # its upload
      # tmp_file = "#{Rails.root}/tmp/file.#{extension}"
      # logger.debug('tmp_file: ' + tmp_file.to_s)
      # file_id = 0

      # # # Check if file with the name exists and generate unique path
      # tmp_file_path = "#{Rails.root}/tmp/image_main_#{params[:id]}.#{extension}"
      # logger.debug('tmp_file_path: ' + tmp_file_path.to_s)
      

      # # Let's write the file from post request to unique location
      # File.open(tmp_file_path, 'wb') do |f|
      #   if ajax_upload
      #     f.write request.body.read
      #   else
      #     f.write params[:image_main].read
      #   end
      # end

      # # Now that file is saved in temp location, we can use Paperclip to mimic one file
      # # upload
      # @photo = Photo.new :photo => File.open(tmp_file_path)
      # logger.debug('@photo.url: ' + @photo.url.to_s)


    end
  end

  # GET /:controller_name/new
  def new
    @target_view = 'new' unless defined? @target_view
    @item = @current_model.new
    logger.debug '@item: ' + @item.to_s
    logger.debug 'controller_name: ' + controller_name.to_s
    logger.debug '@target_view: ' + @target_view.to_s

    respond_to do |format|
      format.html { render @current_admin_view_folder + '/' + @target_view }
    end
  end
  
  # POST /:controller_name
  def create
    # Acknowledge if this is being submitted from a dialog
    # ..this affects how we will deal with messaging and redirecting
    from_dialog = (params.has_key? :from_dialog) ? true : false

    # Remove any empty file upload parameters if this is ajax
    if request.xhr? 
      if defined? self.FILE_UPLOAD_FIELDS
        self.FILE_UPLOAD_FIELDS.each do |fieldname|
          params[controller_name.singularize].delete(fieldname.to_sym) if params[controller_name.singularize][fieldname] == ''
        end
      end
    elsif request.content_type == 'multipart/form-data'
      # Remind the developer to submit the form with ajax if there are file upload fields
      logger.warn('AdminController.create: Forms with file upload fields should generally be submitted with AJAX. Please consider adding ":remote => true" to the form declaration so your users won\'t have to re-upload upon validation errors.')
    end

    # Set params for saving and redirecting
    @current_view = 'new' unless defined? @current_view
    @target_view = 'index' unless defined? @target_view
    @item = @current_model.new(params[controller_name.singularize])

    respond_to do |format|
      begin
        @item.save!
        logger.debug 'AdminController.create success: ' + @current_admin_view_folder + '/' + @target_view

        flash[:notice] = "Changes saved!" unless from_dialog == true
        format.js { render 'admin/assets/after_save', :locals => { :from_dialog => from_dialog, :item_id => @item.id, :action => 'add' } }
        format.html  { redirect_to '/' + @current_admin_view_folder + '/' +  @target_view }
      rescue => e
        logger.debug('AdminController.create errors: ' + @item.errors.full_messages.to_s )

        flash[:error] = e.message unless from_dialog == true
        errors_array = @item.errors.full_messages.present? ? @item.errors.full_messages : [e.message]
        format.js { render 'admin/assets/after_save', :locals => { :from_dialog => from_dialog, :item_id => @item.id, :action => 'add', :errors => errors_array } }
        format.html { render @current_admin_view_folder + '/' +  @current_view }
      end
    end
  end


  # GET /:controller_name/1/edit
  def edit
    @item = @current_model.find(params[:id]) unless defined? @item
    logger.debug '@item: ' + @item.to_s    
    @target_view = 'edit' unless defined? @target_view

    respond_to do |format|
      format.html { render @current_admin_view_folder + '/' + @target_view, :locals => { :item_id => params[:id] } }
    end
  end

  # PUT /:controller_name/1
  def update
    # Acknowledge if this is being submitted from a dialog
    # ..this affects how we will deal with messaging and redirecting
    from_dialog = (params.has_key? :from_dialog) ? true : false

    # Remove any empty file upload parameters if this is ajax
    if request.xhr? 
      if defined? self.FILE_UPLOAD_FIELDS
        self.FILE_UPLOAD_FIELDS.each do |fieldname|
          params[controller_name.singularize].delete(fieldname.to_sym) if params[controller_name.singularize][fieldname] == ''
        end
      end
    elsif request.content_type == 'multipart/form-data'
      # Remind the developer to submit the form with ajax if there are file upload fields
      logger.debug ('AdminController.update: Forms with file upload fields should generally be submitted with AJAX. Please consider adding ":remote => true" to the form declaration so your users won\'t have to re-upload upon validation errors.')
    end

    # Set params for saving and redirecting
    @current_view = 'edit' unless defined? @current_view
    @target_view = 'index' unless defined? @target_view
    @item = @current_model.find(params[:id]) unless defined? @item    

    respond_to do |format|
      begin
        @item.update_attributes!(params[controller_name.singularize])
        logger.debug 'AdminController.update success: admin/' + @current_view_folder + '/' + @target_view
        logger.debug 'AdminController.update is from_dialog: ' + from_dialog.to_s
 
        flash[:notice] = "Changes saved!" unless from_dialog == true
        format.js { render 'admin/assets/after_save', :locals => { :from_dialog => from_dialog, :item_id => params[:id], :action => 'edit' } }
        format.html  { redirect_to '/' + @current_admin_view_folder + '/' +  @target_view }
      rescue => e
        logger.debug('AdminController.update errors caught: ' + e.to_s )
        logger.debug('AdminController.update errors @item.errors: ' + @item.errors.full_messages.to_s )
 
        flash.now[:error] = e.message unless from_dialog == true
        format.js { render 'admin/assets/after_save', :locals => { :from_dialog => from_dialog, :item_id => params[:id], :action => 'edit', :errors => @item.errors.full_messages } }
        format.html  { render @current_admin_view_folder + '/' + @current_view }
      end
    end
  end

  # Changing a single field through a dialog
  # Originally only for "publish"
  def field_change_confirm
    @item = @current_model.find(params[:id])
    logger.debug '@item: ' + @item.to_s

    action = @item.is_active? ? :unpublish : :publish
    
    respond_to do |format|
      format.html { render :partial => '/admin/assets/confirm', :locals => { :item_id => params[:id], :action => action} }
    end
  end


  # DELETE /:controller_name/1
  # GET /:controller_name/1/delete_confirm
  def delete_confirm
    @item = @current_model.find(params[:id])
    logger.debug '@item: ' + @item.to_s

    respond_to do |format|
      format.html { render :partial => '/admin/assets/confirm', :locals => { :item_id => params[:id], :action => :delete } }
    end
  end
  # DELETE /:controller_name/1
  # POST /:controller_name/1/delete
  def destroy
    from_dialog = (params.has_key? :from_dialog) ? true : false

    logger.debug @current_controller + '_controller.delete: ' + params[:id]
    @item = @current_model.find(params[:id])
    logger.debug '@item: ' + @item.to_s    

    respond_to do |format|
      begin
        @item.destroy
        format.js { render 'admin/assets/after_save', :locals => { :from_dialog => from_dialog, :item_id => params[:id], :action => 'delete', :confirm => false } }
      rescue => e
        format.js { render 'admin/assets/after_save', :locals => { :from_dialog => from_dialog, :item_id => params[:id], :action => 'delete', :confirm => false, :error => e.message  } }
      end
    end
  end 


  protected

  def set_scope_parameters
    #
    # controller and action
    #
    @current_action = action_name unless @current_action
    @current_controller = 'admin_' + controller_name unless @current_controller

    logger.debug '#'
    logger.debug '#    @current_controller#@current_action: ' + @current_controller + '#' + @current_action
    
    #
    # model
    #
    begin
      logger.debug '# (setting model based on @current_controller)'
      @current_model = @current_controller.classify.constantize
      logger.debug '#    @current_model: ' + @current_model.name
    rescue
      begin 
        logger.debug '# (setting model based on controller_name)'
        @current_model = controller_name.classify.constantize unless @current_model
        logger.debug '#    @current_model: ' + @current_model.name
      rescue
        @current_model = nil
        logger.debug '#    @current_model: No model'
      end
    end

    #
    # view_folder, admin_view_folder
    #
    # strip out everything but the second folder of the url to find out where the hell we are. Then checking if we passed in an override
    # logger.debug ('admin_controller.rb request.path: ' + request.path)
    if request.path.match('/admin/') 
      current_view_folder_via_url = request.path.sub(/[^\/]*\/admin\//,'').sub(/\/.*/,'') unless @current_view_folder
    else
      current_view_folder_via_url = request.path.sub(/\/([^\/]*)(\/.*)?/,'\1') unless @current_view_folder
    end
    # logger.debug ('admin_controller.rb current_view_folder_via_url: ' + current_view_folder_via_url)

    if params.has_key? :current_view_folder
      # if we're being passed a parameter named "current_view_folder", acknowledge our current folder is NOT our object name
      @current_view_folder = params[:current_view_folder]
      params.delete :current_view_folder
    elsif params.has_key? current_view_folder_via_url.singularize and params[current_view_folder_via_url.singularize].has_key? :current_view_folder
      # if we're being passed a form containing a data object (from new or edit pages), look for a "current_view_folder" override, in case the folder is not the object name
      @current_view_folder = params[current_view_folder_via_url.singularize][:current_view_folder]
      params[current_view_folder_via_url.singularize].delete :current_view_folder
    else
      # our current folder IS our object name, roll with it
      @current_view_folder = current_view_folder_via_url
    end
    @current_admin_view_folder = 'admin/' + @current_view_folder
    logger.debug ('#    @current_view_folder: ' + @current_view_folder)
    logger.debug ('#    @current_admin_view_folder: ' + @current_admin_view_folder)
    
    #
    # item_type, admin_item_type
    #
    @current_item_type = @current_view_folder unless @current_item_type
    @current_admin_item_type = 'admin_' + @current_item_type
    @current_item_name = @current_item_type.humanize.singularize unless @current_item_name
    logger.debug ('#    @current_item_type: ' + @current_item_type)
    logger.debug ('#    @current_admin_item_type: ' + @current_admin_item_type)

    logger.debug '#'

    #logger.debug('current_view_folder_via_url: ' + current_view_folder_via_url)
  end

  def set_order_variables
    #RUSS Refactor this "when the time is right" make order string into two class variables
    # in the model and join those in the search, but then we would be able to access these easier h'nah
    # this isn't right either, since we need to have the ability to have multiple sorts
    # default sort params
    if params[:sort_by].blank?
      #check if also blank in current model
      order_string = @current_model.class_eval("@model_order_string")
      if order_string.blank? #use default params
        @sort_by = 'created_at'
        @sort_order = 'DESC'
      else
        order_params = order_string.split(',')
        order_string_array = order_params[0].split(' ')
        @sort_by = order_string_array[0] unless order_string_array[0].blank?
        @sort_order = order_string_array[1] unless order_string_array[1].blank?
      end
    else #use the params passed in
      @sort_by = params[:sort_by]
      @sort_order = params[:sort_order]
    end
  end

  # temporary while figuring out public vs private SHOW
  def set_meta_content(item)
    set_default_meta_content

    ###### Check to see if need to override defaults ######
    if (item.has_attribute?("news_category") and item.news_item? )
      @description = item.news_long_blurb.present? ? item.news_long_blurb : @description
    end
    if(item.is_a? ContentPage and item.show_meta == 1)
      @description = item.meta_desc.present? ? item.meta_desc : @description
      @authors = item.meta_author.present? ? item.meta_author : @authors
    end

    # if a blog
    if (item.has_attribute?("news_category") and item.news_category == 'Blog')
      @authors = item.meta_author.present? ? item.meta_author : @authors
      @description = item.news_short_blurb
    end
    if (item.show_meta == 1)
      @authors = item.meta_author.present? ? item.meta_author : @authors
      @keywords = item.meta_keywords.present? ? item.meta_keywords : @keywords
    end
  end

  def set_default_meta_content
    config_values = SiteConfigValue.all
    @authors = config_values[0].nil? ? "" : config_values[0].authors
    @keywords = config_values[0].nil? ? "" : config_values[0].meta_keywords
    @description = config_values[0].nil? ? "" : config_values[0].meta_description
  end

  def set_blog_feces
    logger.debug('PublicPageController.set_blog_feces settling down into some blog feces')
    @blog_bio = BlogBio.get_primary_blogger
    @blog_ad = BlogAd.get_random_ad
    @recent_posts =  NewsItem.latest_blog_articles(5)
    @archives = NewsItem.blog_articles_months
    @blogroll =  NewsItem.blog_links('BlogRoll',40)
    @other_sites = NewsItem.blog_links('OtherSites',40)
    @nasa_sites =  NewsItem.blog_links('NASAsites',40)
  end

  def disable_page_caching
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end
end
