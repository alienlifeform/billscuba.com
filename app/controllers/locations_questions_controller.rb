class LocationsQuestionsController < ApplicationController
  # GET /locations_questions
  # GET /locations_questions.json
  def index
    @locations_questions = LocationsQuestion.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @locations_questions }
    end
  end

  # GET /locations_questions/1
  # GET /locations_questions/1.json
  def show
    @locations_question = LocationsQuestion.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @locations_question }
    end
  end

  # GET /locations_questions/new
  # GET /locations_questions/new.json
  def new
    @locations_question = LocationsQuestion.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @locations_question }
    end
  end

  # GET /locations_questions/1/edit
  def edit
    @locations_question = LocationsQuestion.find(params[:id])
  end

  # POST /locations_questions
  # POST /locations_questions.json
  def create
    @locations_question = LocationsQuestion.new(params[:locations_question])

    respond_to do |format|
      if @locations_question.save
        format.html { redirect_to @locations_question, notice: 'Locations question was successfully created.' }
        format.json { render json: @locations_question, status: :created, location: @locations_question }
      else
        format.html { render action: "new" }
        format.json { render json: @locations_question.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /locations_questions/1
  # PUT /locations_questions/1.json
  def update
    @locations_question = LocationsQuestion.find(params[:id])

    respond_to do |format|
      if @locations_question.update_attributes(params[:locations_question])
        format.html { redirect_to @locations_question, notice: 'Locations question was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @locations_question.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /locations_questions/1
  # DELETE /locations_questions/1.json
  def destroy
    @locations_question = LocationsQuestion.find(params[:id])
    @locations_question.destroy

    respond_to do |format|
      format.html { redirect_to locations_questions_url }
      format.json { head :no_content }
    end
  end
end
