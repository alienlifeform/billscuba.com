module ActiveRecordExtensions
  extend ActiveSupport::Concern

  # 
  # Active = viewable on public-facing website
  #
  def is_active?
    # default way to check for active/published is by expecting status = '1' or status = 1
    if defined? self.status
      if status.to_s == '1'
        true
      else
        false
      end
    else
      true
    end
  end
  def activate
    if defined? self.status
      self.status = 1
    end
  end

  #
  # Methods for dealing with arrays of ids in a db field
  #
  # Get all items of a certain type
  def get_items (item_type)
    logger.debug "Finding all_items(" + item_type.to_s + "): #{eval(item_type.to_s + '_ids').inspect}"
    find_by_ordered_id_csv(eval(item_type.to_s + '_ids'), eval(item_type.to_s.camelize))
  end

  # Check for existence of a certain item
  def has_item (item_type, item_id)
    if (eval(item_type.to_s + '_ids').nil?)
      false
    else
      eval(item_type.to_s + '_ids').split(',').map(&:to_i).index(item_id) ? true : false
    end
  end

  # Remove items from list
  def remove_item (item_type, item_id)
    #logger.debug('Newsletter.remove_item(' + item_type.to_s + ', ' + item_id + ')')
    ids_after_removal = eval(item_type.to_s + '_ids').split(',').select { |id| id != item_id.to_s }.join(',')
    update_attribute(item_type.to_s + "_ids", ids_after_removal) # update db
    send (item_type.to_s + '_ids=').to_sym, ids_after_removal # update instance variable
  end

  def add_item(item_type, item_id)
    logger.debug('add_item(' + item_type.to_s + ', ' + item_id.to_s + ')')
    if eval('self.' + item_type.to_s + '_ids').blank?
      update_attribute(item_type.to_s + "_ids", item_id.to_s)
    else
      update_attribute(item_type.to_s + "_ids", item_id.to_s << "," << eval(item_type.to_s + '_ids'))
    end
  end

  protected

  def find_by_ordered_id_csv(id_string, model)
    if (id_string)
      find_by_ordered_id_array(id_string.split(',').map(&:to_i), model) # split csv into array of integers
    end
    # BERGEN maybe try Model.find(array_of_primary_key) accepts an array of primary keys, returning an array containing all of the matching records for the supplied primary keys.
    # Find the clients with primary keys 1 and 10:
    #    client = Client.find([1, 10]) # Or even Client.find(1, 10)
    # => [#<Client id: 1, first_name: "Lifo">, #<Client id: 10, first_name: "Ryan">]
  end

  def find_by_ordered_id_array(id_array, model)
    #items = model.find(id_array) # find all these ids in db
    items = model.where("id in (?)", id_array) # find all these ids in db
    items = items.sort_by { |item| id_array.index(item.id) } # sort by id_array using Schwartzian transform
  end


  module ClassMethods
    def search (search_params, filter_by, filter_params, sort_by, sort_order, page_number, items_per_page)
      query_string_array = []
      # incorporate optional search
      unless @model_search_query.blank?
        query_string_array.push(@model_search_query)
      end

      # incorporate optional filter
      if @model_filter_query.present?
        query_string_array.push(@model_filter_query)
      else
        unless filter_params.blank? or filter_by.blank?
          query_string_array.push("\"" + filter_by + "\" = '" + filter_params + "'")
        end
      end


      # set whole query_string
      query_string = query_string_array.join(' and ')

      # order
      order_string = @model_order_string
      unless sort_by.blank?
        if sort_order.blank?
          #order_string = "\"" + sort_by + "\" ASC"
          order_string = sort_by + " ASC"
        else
          #order_string = "\"" + sort_by + "\" " + sort_order
          order_string = sort_by + " " + sort_order
        end
      end
      #logger.debug('SORT STRING: ' + order_string)
      if query_string.blank?
        self.order(order_string).page(page_number).per(items_per_page)
      else
        #self.page(page_number).per(items_per_page)
        self.where(query_string).order(order_string).page(page_number).per(items_per_page)
      end
    end

  end
end

ActiveRecord::Base.send(:include, ActiveRecordExtensions)