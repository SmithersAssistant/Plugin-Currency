'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _styles = require('./styles');

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var CURRENCY_COMPONENT = 'com.robinmalfait.currency';

exports.default = function (robot) {
  var React = robot.dependencies.React;
  var Blank = robot.cards.Blank;
  var _robot$UI = robot.UI;
  var classNames = _robot$UI.classNames;
  var material = _robot$UI.material;
  var TextField = material.TextField;
  var SelectField = material.SelectField;
  var MenuItem = material.MenuItem;
  var enhance = robot.enhance;
  var withStyles = robot.withStyles;
  var restorableComponent = robot.restorableComponent;


  var Currency = React.createClass({
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


      return React.createElement(SelectField, {
        style: { width: 100 },
        floatingLabelText: title,
        floatingLabelFixed: true,
        onChange: callback, value: current,
        children: Object.keys(rates).sort().map(function (rate) {
          return React.createElement(MenuItem, {
            primaryText: rate,
            key: rate,
            value: rate
          });
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
      var _props2 = this.props;
      var styles = _props2.styles;

      var other = _objectWithoutProperties(_props2, ['styles']);

      var _state = this.state;
      var amount = _state.amount;
      var from = _state.from;
      var to = _state.to;
      var date = _state.date;


      var props = robot.deleteProps(other, ['date', 'amount']);

      return React.createElement(
        Blank,
        _extends({}, props, { title: 'Currency' }),
        React.createElement(
          'h1',
          { className: styles.display },
          this.amount(),
          ' ',
          from,
          ' = ',
          this.computeCurrency(from, to, this.amount()),
          ' ',
          to
        ),
        React.createElement('hr', null),
        React.createElement(
          'small',
          {
            className: classNames('right', styles.lastChecked)
          },
          '(Last checked: ',
          date,
          ')'
        ),
        React.createElement(
          'div',
          { className: classNames('left', styles.actions) },
          React.createElement(TextField, {
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

  robot.registerComponent(enhance(Currency, [restorableComponent, withStyles(_styles2.default)]), CURRENCY_COMPONENT);

  robot.listen(/^currency$/, {
    description: "Currency converter widget",
    usage: 'currency'
  }, function () {
    robot.addCard(CURRENCY_COMPONENT);
  });
};