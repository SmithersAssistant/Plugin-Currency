import styles from './styles';

const CURRENCY_COMPONENT = 'com.robinmalfait.currency';

export default robot => {
  const { React } = robot.dependencies
  const { Blank } = robot.cards
  const { classNames, material } = robot.UI
  const { TextField, SelectField, MenuItem } = material
  const { enhance, withStyles, restorableComponent } = robot

  const Currency = React.createClass({
    getDefaultProps() {
      return {
        from: 'EUR',
        to: 'EUR',
        date: '',
        amount: 1
      }
    },
    getInitialState() {
      const { from, to, amount } = this.props

      return {
        from,
        to,
        amount,
        rates: {}
      }
    },
    componentDidMount() {
      robot.fetchJson("https://api.fixer.io/latest")
        .then(data => this.setState({ date: data.date, rates: { ...data.rates, ...{ EUR: 1 } } }))
    },
    setAmount(e) {
      this.setState({ amount: e.target.value.replace(',', '.') })
    },
    amount() {
      return (+this.state.amount) || 0
    },
    changeFrom(e, index, value) {
      this.setState({ from: value })
    },
    changeTo(e, index, value) {
      this.setState({ to: value })
    },
    choice(current, title, callback) {
      const { rates } = this.state

      return (
        <SelectField
          style={{ width: 100 }}
          floatingLabelText={title}
          floatingLabelFixed={true}
          onChange={callback} value={current}
          children={Object.keys(rates).sort().map(rate => (
            <MenuItem
              primaryText={rate}
              key={rate}
              value={rate}
            />
          ))}
        />
      )
    },
    computeCurrency(from, to, amount) {
      const { rates } = this.state;

      if (rates.length == 0) return 0;

      const fromRate = rates[ from ] || 1;
      const toRate = rates[ to ] || 1;

      return ((amount * toRate / fromRate) * 1.0).toFixed(4);
    },
    render() {
      const { styles, ...other } = this.props;
      const { amount, from, to, date } = this.state;

      const props = robot.deleteProps(other, [
        'date', 'amount'
      ]);

      return (
        <Blank {...props} title="Currency">
          <h1 className={styles.display}>{this.amount()} {from} = {this.computeCurrency(from, to, this.amount())} {to}</h1>

          <hr/>

          <small
            className={classNames('right', styles.lastChecked)}
          >
            (Last checked: {date})
          </small>

          <div className={classNames('left', styles.actions)}>
            <TextField
              style={{ width: 100 }}
              floatingLabelText="Amount"
              floatingLabelFixed={true}
              onChange={this.setAmount}
              value={amount}
            />
            {this.choice(from, 'From', this.changeFrom)}
            {this.choice(to, 'To', this.changeTo)}
          </div>
        </Blank>
      )
    }
  })

  robot.registerComponent(enhance(Currency, [
    restorableComponent,
    withStyles(styles)
  ]), CURRENCY_COMPONENT);

  robot.listen(/^currency$/, {
    description: "Currency converter widget",
    usage: 'currency'
  }, () => {
    robot.addCard(CURRENCY_COMPONENT);
  });
}
