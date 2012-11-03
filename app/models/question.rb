class Question < ActiveRecord::Base
  attr_accessible :option_label, :option_value, :style, :subtitle, :title
end
