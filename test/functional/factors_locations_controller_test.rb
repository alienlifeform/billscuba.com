require 'test_helper'

class FactorsLocationsControllerTest < ActionController::TestCase
  setup do
    @factors_location = factors_locations(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:factors_locations)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create factors_location" do
    assert_difference('FactorsLocation.count') do
      post :create, factors_location: { description: @factors_location.description, factor_id: @factors_location.factor_id, location_id: @factors_location.location_id, value: @factors_location.value }
    end

    assert_redirected_to factors_location_path(assigns(:factors_location))
  end

  test "should show factors_location" do
    get :show, id: @factors_location
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @factors_location
    assert_response :success
  end

  test "should update factors_location" do
    put :update, id: @factors_location, factors_location: { description: @factors_location.description, factor_id: @factors_location.factor_id, location_id: @factors_location.location_id, value: @factors_location.value }
    assert_redirected_to factors_location_path(assigns(:factors_location))
  end

  test "should destroy factors_location" do
    assert_difference('FactorsLocation.count', -1) do
      delete :destroy, id: @factors_location
    end

    assert_redirected_to factors_locations_path
  end
end
