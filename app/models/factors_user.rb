class FactorsUser < ActiveRecord::Base
  attr_accessible :description, :factor_id, :user_id, :value
end
