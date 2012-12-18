class LocationsQuestion < ActiveRecord::Base
  attr_accessible :location_id, :question_id, :value
  belongs_to :location
  belongs_to :question
end
