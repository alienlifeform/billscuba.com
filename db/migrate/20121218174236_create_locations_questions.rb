class CreateLocationsQuestions < ActiveRecord::Migration
  def change
    create_table :locations_questions do |t|
      t.integer :location_id
      t.integer :question_id
      t.integer :value

      t.timestamps
    end
  end
end
