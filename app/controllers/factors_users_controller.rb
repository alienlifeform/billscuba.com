class FactorsUsersController < ApplicationController
  # GET /factors_users
  # GET /factors_users.json
  def index
    @factors_users = FactorsUser.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @factors_users }
    end
  end

  # GET /factors_users/1
  # GET /factors_users/1.json
  def show
    @factors_user = FactorsUser.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @factors_user }
    end
  end

  # GET /factors_users/new
  # GET /factors_users/new.json
  def new
    @factors_user = FactorsUser.new
    
    if (params.has_key? :factor_id and params[:factor_id].to_i > 0)
      this_factor = Factor.where("id >= #{params[:factor_id]} and show_in_survey = true").order("id asc").first
    else
      this_factor = Factor.first
    end
    
    if this_factor.present?
      @factor_id = this_factor.id
    else 
      respond_to do |format|
        format.html { redirect_to "/factors_users", notice: 'Survey completed.' and return }
      end
    end    

    @user_id = User.last.id
    #@last_factors_user_id = FactorsUser.last.id

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @factors_user }
    end
  end

  # GET /factors_users/1/edit
  def edit
    @factors_user = FactorsUser.find(params[:id])
    #@last_factors_user_id = FactorsUser.last.id
  end

  # POST /factors_users
  # POST /factors_users.json
  def create
    @factors_user = FactorsUser.new(params[:factors_user])

    respond_to do |format|
      if @factors_user.save
        format.html { redirect_to "/factors_users/new?factor_id=#{@factors_user.factor_id + 1}", notice: 'Factors user was successfully created.' }
        format.json { render json: @factors_user, status: :created, location: @factors_user }
      else
        format.html { render action: "new" }
        format.json { render json: @factors_user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /factors_users/1
  # PUT /factors_users/1.json
  def update
    @factors_user = FactorsUser.find(params[:id])

    respond_to do |format|
      if @factors_user.update_attributes(params[:factors_user])
        format.html { redirect_to @factors_user, notice: 'Factors user was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @factors_user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /factors_users/1
  # DELETE /factors_users/1.json
  def destroy
    @factors_user = FactorsUser.find(params[:id])
    @factors_user.destroy

    respond_to do |format|
      format.html { redirect_to factors_users_url }
      format.json { head :no_content }
    end
  end
end
