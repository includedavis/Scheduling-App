import React, {Component} from 'react';
import {Input, Form, Label} from 'semantic-ui-react';
import {omit} from 'lodash';

//
export default class InputComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value
        }
    }

    static propTypes = {
        validate: React.PropTypes.func,
        connectToParent: React.PropTypes.func,
        value: React.PropTypes.any,
        error: React.PropTypes.string,
        labelText: React.PropTypes.string,
        label: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        name: React.PropTypes.string,
        type: React.PropTypes.string,
        as: React.PropTypes.node,
        action: React.PropTypes.any
    }

    handleChange(event) {
        let state = {
            value: event.target.value
        }
        let {validate, name} = this.props;
        if (validate) {
            state.error = validate(state.value, name) // if valid, then false!
            this.props.connectToParent({name, ...state})
        }
        this.setState(state)
    }

    componentWillMount() {
        if (this.props.validate) {
            this.setState({
                error: this.props.validate(this.props.value, this.props.name)
            })
        }
    }

    componentWillReceiveProps() {
        // PROPS ERROR TO STATE ERROR
        let {error} = this.props;
        if (error && error[0]) {
            this.setState({
                error: error || null
            })
        }
    }

    render() {
        // STATE ERROR
        let {error, value} = this.state;
        let propsToOmit = ['validate', 'error', 'connectToParent', 'as']

        let propsForInput = {
            ...this.props,
            onChange: this.handleChange.bind(this),
            value
        }

        let RenderComponentAsProp;
        let propAsElemExists = false;
        if (this.props.as) {
            propAsElemExists = true;
            RenderComponentAsProp = this.props.as;
        }

        let propsForField;
        if (error) {
            propsForField = {error:true}
        }
        propsForInput = omit(propsForInput, propsToOmit)

        // labelText(custom) - is a TEXT label
        // label - is a BUTTON label
        // check semantic-react docs
        let labelTextComponent = null
        if (propsForInput.labelText) {
            labelTextComponent = (<label>{propsForInput.labelText}</label>)
            delete propsForInput.labelText
        }



        return (

            // in semantic if input is a part of form, we can make it error-visible
            // only throught the Form.Field error
            <Form.Field {...propsForField}>
                {/* <label> analog */}
                {labelTextComponent}
                {/* Input, checkbox, textarea, etc. */}
                {/*//
                    REVIEW: @Metnew 8.02 10:00, still have questions about correctness of this
                    implementation, due to <Form.Group> component probable incompability
                    */}

                {propAsElemExists ?
                    <RenderComponentAsProp {...propsForInput} /> :
                    <Input {...propsForInput} />
                }

                {/* display tooltip with error */}
                {error && <Label basic color='red' pointing>{error}</Label>}
            </Form.Field>

        )
    }
}
