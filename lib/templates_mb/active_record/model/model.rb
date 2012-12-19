class <%= class_name %> < ActiveRecord::Base
  attr_accessible <%= attributes.map { |a| ":#{a.name}" }.join(", ") %>

  # def self.search(search_params, filter_by, filter_params, sort_by, sort_order, page_number, items_per_page)
  #   @model_order_string = "\"title\" asc"
  #   if search_params.blank?
  #     @model_search_query = nil
  #   else
  #     @model_search_query = "(\"title\" ilike '%" + search_params + "%' or \"category\" ilike '%" + search_params + "%')"
  #   end
  #   super
  # end

end

