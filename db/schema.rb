# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20121219074736) do

  create_table "factors", :force => true do |t|
    t.string   "title"
    t.string   "style"
    t.boolean  "show_in_survey"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  create_table "factors_locations", :force => true do |t|
    t.integer  "factor_id"
    t.integer  "location_id"
    t.integer  "value"
    t.text     "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "factors_users", :force => true do |t|
    t.integer  "factor_id"
    t.integer  "user_id"
    t.integer  "value"
    t.text     "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "locations", :force => true do |t|
    t.string   "title"
    t.text     "short_desc"
    t.text     "long_desc"
    t.string   "city"
    t.string   "region"
    t.string   "country"
    t.string   "geography"
    t.string   "population"
    t.string   "image_1"
    t.string   "image_2"
    t.datetime "created_at",                       :null => false
    t.datetime "updated_at",                       :null => false
    t.text     "activities"
    t.text     "distance_to_hospital"
    t.text     "distance_to_airport"
    t.text     "internet_speed"
    t.text     "climate"
    t.text     "amenities"
    t.text     "expat_population"
    t.text     "health_care"
    t.text     "distance_to_international_school"
    t.text     "kids_friendliness"
    t.text     "quaintness"
    t.text     "interesting_activities_events"
    t.text     "liberal_or_conservative"
    t.text     "same_sex_friendly"
    t.text     "religions"
    t.text     "nightlife"
    t.text     "distance_to_nightlife"
    t.integer  "nightlife_index"
    t.text     "province"
    t.text     "elevation"
    t.text     "distance_to_city"
  end

  create_table "pages", :force => true do |t|
    t.string   "title"
    t.text     "top_nav_links"
    t.text     "main_area_1"
    t.text     "main_area_2"
    t.text     "main_area_3"
    t.text     "side_area_1"
    t.text     "side_area_2"
    t.text     "side_area_3"
    t.string   "template"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "site_configs", :force => true do |t|
    t.string   "title"
    t.text     "desc"
    t.string   "logo"
    t.text     "contact_us_blurb"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
    t.text     "top_nav_links"
    t.text     "footer_links"
  end

  create_table "users", :force => true do |t|
    t.string   "email"
    t.string   "first_name"
    t.string   "last_name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
