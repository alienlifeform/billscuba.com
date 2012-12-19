class FactorsLocationsController < ApplicationController
  # GET /factors_locations
  # GET /factors_locations.json
  def index
    @factors_locations = FactorsLocation.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @factors_locations }
    end
  end

  # GET /factors_locations/1
  # GET /factors_locations/1.json
  def show
    @factors_location = FactorsLocation.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @factors_location }
    end
  end

  # GET /factors_locations/new
  # GET /factors_locations/new.json
  def new
    @factors_location = FactorsLocation.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @factors_location }
    end
  end

  # GET /factors_locations/1/edit
  def edit
    @factors_location = FactorsLocation.find(params[:id])
  end

  # POST /factors_locations
  # POST /factors_locations.json
  def create
    @factors_location = FactorsLocation.new(params[:factors_location])

    respond_to do |format|
      if @factors_location.save
        format.html { redirect_to @factors_location, notice: 'FactorsLocation was successfully created.' }
        format.json { render json: @factors_location, status: :created, factors_location: @factors_location }
      else
        format.html { render action: "new" }
        format.json { render json: @factors_location.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /factors_locations/1
  # PUT /factors_locations/1.json
  def update
    @factors_location = FactorsLocation.find(params[:id])

    respond_to do |format|
      if @factors_location.update_attributes(params[:factors_location])
        format.html { redirect_to @factors_location, notice: 'FactorsLocation was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @factors_location.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /factors_locations/1
  # DELETE /factors_locations/1.json
  def destroy
    @factors_location = FactorsLocation.find(params[:id])
    @factors_location.destroy

    respond_to do |format|
      format.html { redirect_to factors_locations_url }
      format.json { head :no_content }
    end
  end
end
