class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.string :title
      t.string :subtitle
      t.string :option_label
      t.string :option_value
      t.string :style

      t.timestamps
    end
  end
end
