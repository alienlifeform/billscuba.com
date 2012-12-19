class CreateFactorsUsers < ActiveRecord::Migration
  def change
    create_table :factors_users do |t|
      t.integer :factor_id
      t.integer :user_id
      t.integer :value
      t.text :description

      t.timestamps
    end
  end
end
