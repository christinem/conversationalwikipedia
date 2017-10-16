import React from "react";
import { render } from "react-dom";
import Search from './search.jsx';
import PubList from './publist.jsx';
import GraphView from './graphview.jsx';
import Overview from './overview.jsx';
import Note from './note.jsx';

var d3 = require('d3');
var thread = require('thread-js');

var HomePage = React.createClass({

    render: function() {
        return (
            <div>
                
            </div>
        );
    }
});

String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};


render(<HomePage />, document.getElementById("root"));