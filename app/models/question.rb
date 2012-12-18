class Question < ActiveRecord::Base
  attr_accessible :option_label, :option_value, :style, :subtitle, :title
  has_many :locations_questions
  has_many :locations, :through => :locations_questions
end
