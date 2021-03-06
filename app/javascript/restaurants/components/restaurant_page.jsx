import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BookingForm from './booking_form';
import RestaurantPhotos from './restaurant_photos';
import ReviewsContainer from './reviews_container';
import RestaurantAbout from './restaurant_about';
import StarsWithGradient from './stars_with_gradient';
import PriceLevel from './price_level';
import { fetchRestaurant } from '../actions/restaurant';

class RestaurantPage extends Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    this.state = {
      restaurant: location.state ? location.state.restaurant : null,
    };
  }

  componentDidMount() {
    this.fetchRestaurant();
  }

  fetchRestaurant = () => {
    const { restaurant } = this.props.match.params;
    fetchRestaurant(restaurant)
      .then(response => this.setState({ restaurant: response.data }))
      .catch(error => console.log(error));
  }

  ifAdmin = () => {
    const { user } = this.props;
    const { restaurant } = this.state;
    if (user) {
      if (user.admin) {
        return (
          <Link className="link" to={`/restaurants/${restaurant.id}/admin`}>
            Admin Page
          </Link>
        );
      }
    }
    return null;
  }

  render() {
    const { restaurant } = this.state;
    const { user, openLogInModal, location } = this.props;
    if (restaurant === null) {
      return <div />;
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 restaurant-page-title-container">
            <div>
              <div className="restaurant-page-title">
                {restaurant.name}
              </div>
              <div className="restaurant-basic-info">
                <div className="restaurant-basic-info-rating">
                  <div className="restaurant-basic-info-star-container">
                    <StarsWithGradient starClass="restaurant-basic-info-stars" avgRating={restaurant.avg_rating} />
                  </div>
                  <div>{Math.round(restaurant.avg_rating * 10) / 10}</div>
                </div>
                <div className="restaurant-basic-info-price-level">
                  <PriceLevel priceLevel={restaurant.price_level} />
                </div>
                <div className="restaurant-basic-info-cuisine">
                  {restaurant.cuisine.name}
                </div>
              </div>
            </div>
            {this.ifAdmin()}
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-7 order-2 order-sm-1">
            <RestaurantPhotos photos={restaurant.restaurant_photos} />
            <RestaurantAbout restaurantAbout={restaurant.description} />
            {restaurant.reviews
              ? (
                <ReviewsContainer
                  openLogInModal={openLogInModal}
                  restaurant={restaurant}
                  user={user}
                  reviews={restaurant.reviews}
                />
              )
              : null
            }
          </div>
          <BookingForm
            openLogInModal={openLogInModal}
            user={user}
            restaurant={restaurant}
            selectedTimeSlot={location.state ? location.state.selectedTimeSlot : null}
          />
        </div>
      </div>
    );
  }
}
export default RestaurantPage;
