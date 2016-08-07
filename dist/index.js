'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var CURRENCY_COMPONENT = 'com.robinmalfait.currency';

exports.default = function (robot) {
  var Blank = robot.cards.Blank;
  var _robot$UI = robot.UI;
  var TextField = _robot$UI.TextField;
  var SelectField = _robot$UI.SelectField;


  var Currency = _react2.default.createClass({
    displayName: 'Currency',
    getDefaultProps: function getDefaultProps() {
      return {
        from: 'EUR',
        to: 'EUR',
        date: '',
        amount: 1
      };
    },
    getInitialState: function getInitialState() {
      var _props = this.props;
      var from = _props.from;
      var to = _props.to;
      var amount = _props.amount;


      return {
        from: from,
        to: to,
        amount: amount,
        rates: {}
      };
    },
    componentDidMount: function componentDidMount() {
      var _this = this;

      robot.fetchJson("https://api.fixer.io/latest").then(function (data) {
        return _this.setState({ date: data.date, rates: _extends({}, data.rates, { EUR: 1 }) });
      });
    },
    setAmount: function setAmount(e) {
      this.setState({ amount: e.target.value.replace(',', '.') });
    },
    amount: function amount() {
      return +this.state.amount || 0;
    },
    changeFrom: function changeFrom(e, index, value) {
      this.setState({ from: value });
    },
    changeTo: function changeTo(e, index, value) {
      this.setState({ to: value });
    },
    choice: function choice(current, title, callback) {
      var rates = this.state.rates;


      return _react2.default.createElement(SelectField, {
        style: { width: 100 },
        floatingLabelText: title,
        floatingLabelFixed: true,
        onChange: callback, value: current,
        children: Object.keys(rates).sort().map(function (rate) {
          return {
            name: rate,
            value: rate
          };
        })
      });
    },
    computeCurrency: function computeCurrency(from, to, amount) {
      var rates = this.state.rates;


      if (rates.length == 0) return 0;

      var fromRate = rates[from] || 1;
      var toRate = rates[to] || 1;

      return (amount * toRate / fromRate * 1.0).toFixed(4);
    },
    render: function render() {
      var other = _objectWithoutProperties(this.props, []);

      var _state = this.state;
      var amount = _state.amount;
      var from = _state.from;
      var to = _state.to;
      var date = _state.date;


      return _react2.default.createElement(
        Blank,
        _extends({}, other, { title: 'Currency' }),
        _react2.default.createElement(
          'h1',
          { style: {
              textAlign: 'center',
              padding: 50
            } },
          this.amount(),
          ' ',
          from,
          ' = ',
          this.computeCurrency(from, to, this.amount()),
          ' ',
          to
        ),
        _react2.default.createElement('hr', null),
        _react2.default.createElement(
          'small',
          { className: 'right', style: {
              display: 'flex',
              alignItems: 'center',
              height: 72
            } },
          '(Last checked: ',
          date,
          ')'
        ),
        _react2.default.createElement(
          'div',
          { className: 'left', style: {
              display: 'flex',
              justifyContent: 'space-around',
              width: 330,
              height: 72
            } },
          _react2.default.createElement(TextField, {
            style: { width: 100 },
            floatingLabelText: 'Amount',
            floatingLabelFixed: true,
            onChange: this.setAmount,
            value: amount
          }),
          this.choice(from, 'From', this.changeFrom),
          this.choice(to, 'To', this.changeTo)
        )
      );
    }
  });

  robot.registerComponent(Currency, CURRENCY_COMPONENT);

  robot.listen(/^currency$/, {
    description: "Currency converter widget",
    usage: 'currency'
  }, function () {
    robot.addCard(CURRENCY_COMPONENT);
  });
};