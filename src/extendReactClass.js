/* eslint-disable react/prop-types */

import _ from 'lodash';
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import linkClass from './linkClass';
import renderNothing from './renderNothing';

/**
 * @param {ReactClass} Component
 * @param {Object} defaultStyles
 * @param {Object} options
 * @returns {ReactClass}
 */
export default (Component: Object, defaultStyles: Object, options: Object) => {
  const WrappedComponent = class extends Component {
    render () {
      let styles;

      const hasDefaultstyles = _.isObject(defaultStyles);

      if (this.props.styles || hasDefaultstyles) {
        const props = Object.assign({}, this.props);

        if (this.props.styles) {
          styles = this.props.styles;
        } else if (hasDefaultstyles) {
          styles = defaultStyles;
          delete this.props.styles;
        }

        Object.defineProperty(props, 'styles', {
          configurable: true,
          enumerable: false,
          value: styles,
          writable: false
        });

        // Removed to fix this bug https://github.com/gajus/react-css-modules/issues/272
        // this.props = props;
      } else {
        styles = {};
      }

      const renderResult = super.render();

      if (renderResult) {
        return linkClass(renderResult, styles, options);
      }

      return renderNothing(React.version);
    }
  };

  return hoistNonReactStatics(WrappedComponent, Component);
};
