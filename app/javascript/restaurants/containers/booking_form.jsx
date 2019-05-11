import React, { Component } from 'react';
import Modal from 'react-modal';
import SelectableTimeSlot from './selectable_time_slot';
import ConfirmationModal from './confirmation_modal';
import formatDate from '../utils/yymmdd_date';

const BASE_URL = '/api/v1';
const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root');

class BookingForm extends Component {
  constructor() {
    super();
    this.state = {
      date: formatDate(new Date()),
      tableSize: '2',
      selectedTimeSlot: null,
      name: '',
      email: '',
      number: '',
      timeSlots: [],
      modalIsOpen: false,
      dateValid: true,
      tableSizeValid: true,
      selectedTimeSlotValid: true,
      nameValid: true,
      emailValid: true,
      numberValid: true,
    };
  }
  
  componentDidMount() {
    this.fetchTimeSlots()
  }

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  selectTimeSlot = (timeSlot) => {
    this.setState({ selectedTimeSlot: timeSlot })
  }

  fetchTimeSlots = () => {
    const { restaurant } = this.props;
    const start = new Date(this.state.date).setHours(0, 0, 0, 0);
    const end = new Date(this.state.date).setHours(23, 59, 59, 999);
    fetch(`${BASE_URL}/restaurants/${restaurant.id}/time_slots?start=${start}&end=${end}`)
      .then(response => response.json())
      .then(data => this.setState({ timeSlots: data }));
  }

  handleChangeDate = (event) => {
    const target = event.target
    const name = target.name;

    if (target.value !== "") {
      this.setState({[name]: target.value}, this.fetchTimeSlots)
    } else {
      this.setState({[name]: target.value});
    }
    this.setState({selectedTimeSlot: null})
  }

  handleChange = (event) => {
    const target = event.target
    const name = target.name;
    this.setState({[name]: target.value});
  }

  validateForm = () => {
    let dateValid = this.state.dateValid
    let selectedTimeSlotValid = this.state.selectedTimeSlotValid
    let nameValid = this.state.nameValid
    let emailValid = this.state.emailValid
    let numberValid = this.state.numberValid

    dateValid = (/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).test(this.state.date)
    nameValid = this.state.name.length > 0
    selectedTimeSlotValid = this.state.selectedTimeSlot !== null
    emailValid = (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this.state.email)
    numberValid = (/[0-9]{5,15}/).test(this.state.number)

    this.setState({dateValid: dateValid,
                  nameValid: nameValid,
                  selectedTimeSlotValid: selectedTimeSlotValid,
                  emailValid: emailValid,
                  numberValid: numberValid,
                  });

    return (dateValid && nameValid && selectedTimeSlotValid && emailValid && numberValid)
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.validateForm()) {
      this.openModal()
    }
  }

  render() {
    const { timeSlots } = this.state
    return (
      <div className="col-12 col-sm-5">
        <div className="booking-form">
          <form onSubmit={this.handleSubmit}>
            <div className={this.state.dateValid ? "bookingform-date" : "bookingform-date invalid"} >
              <input type="date" name="date" value={this.state.date} onChange={this.handleChangeDate} />
            </div>
            <div className="bookingform-tablesize">
              <select name="tableSize" defaultValue={this.state.tableSize} onChange={this.handleChange}>
                <option value="2">2 people</option>
                <option value="3">3 people</option>
                <option value="4">4 people</option>
                <option value="5">5 people</option>
                <option value="6">6 people</option>
              </select>
            </div>
            <div className={this.state.nameValid ? "bookingform-name" : "bookingform-name invalid"}>
              <input type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name" />
            </div>
            <div className={this.state.emailValid ? "bookingform-email" : "bookingform-email invalid"}>
              <input type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" />
            </div>
            <div className={this.state.numberValid ? "bookingform-number" : "bookingform-number invalid"}>
              <input type="text" name="number" value={this.state.number} onChange={this.handleChange} placeholder="Number"/>
            </div>
            <div className="bookingform-submit">
              <input type="submit" value="Submit" />
            </div>
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              contentLabel="Confirm Modal"
              style={modalStyles}
            >
              <ConfirmationModal closeModal={this.closeModal} bookingForm={this.state}/>
            </Modal>
          </form>
          <div className={this.state.selectedTimeSlotValid ? "select-time-slots-container" : "select-time-slots-container invalid"}>
            {timeSlots.map(timeSlot => <SelectableTimeSlot key={timeSlot.id} timeSlot={timeSlot} selectedTimeSlot={this.state.selectedTimeSlot} selectTimeSlot={this.selectTimeSlot}/>)}
          </div>
        </div>
      </div>
    );
  }
}
export default BookingForm;