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

ActiveRecord::Schema.define(:version => 20121218174236) do

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
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "locations_questions", :force => true do |t|
    t.integer  "location_id"
    t.integer  "question_id"
    t.integer  "value"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
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

  create_table "questions", :force => true do |t|
    t.string   "title"
    t.string   "subtitle"
    t.string   "option_label"
    t.string   "option_value"
    t.string   "style"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
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

end
