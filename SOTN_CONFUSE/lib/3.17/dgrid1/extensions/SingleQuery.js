//>>built
define("dgrid1/extensions/SingleQuery",["dojo/_base/declare","dojo/dom-construct","dgrid/_StoreMixin"],function(b,d,e){return b(e,{refresh:function(){var a=this;this.inherited(arguments);if(this._renderedCollection)return this._trackError(function(){var b=a.loadingNode=d.create("div",{className:"dgrid-loading",innerHTML:a.loadingMessage},a.contentNode),c=a._renderedCollection.fetch();c.totalLength.then(function(b){(a._total=b)||a._insertNoDataNode()});c.always(function(){d.destroy(b);a.loadingNode=
null});return a.renderQueryResults(c).then(function(b){a._emitRefreshComplete();return b})})},renderArray:function(){var a=this.inherited(arguments);this._lastCollection=null;return a}})});