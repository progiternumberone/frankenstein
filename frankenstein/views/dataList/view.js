define([ "marionette" , "dataList/detailView" ],
	function( Marionette , ItemView ) {
		var DataListView = Marionette.CollectionView.extend({
			childView: ItemView
			,tagName: "dl"
			
			,onRemoveChild: function() {
				this.addClearBreaks();
			}
			
			,onAttach: function() {
				this.addClearBreaks();
			}
			
			,addClearBreaks: function() {
				/*clear current clear breaks to put them back in the right places*/
				this.$( "> br" ).remove();
				/*add clear breaks after every configured number of items*/
				if( this.children.length > 0 && this.children.findByIndex(0) ) {
					$( '<br style="clear: both;" class="hidden-xs" />' ).insertAfter( this.$el.find( this.children.findByIndex(0).tagName + ":nth-child(" + this.itemPerRow + "n)" ) );
				}
			}
		});
		
		return DataListView;
	}
);