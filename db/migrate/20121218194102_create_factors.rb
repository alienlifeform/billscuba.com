class CreateFactors < ActiveRecord::Migration
  def change
    create_table :factors do |t|
      t.string :title
      t.string :type
      t.boolean :show_in_survey

      t.timestamps
    end
  end
end
