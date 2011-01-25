/**
 * Controls: Table plugin
 * 
 * Depends on jWYSIWYG
 */
(function ($) {
	if (undefined === $.wysiwyg) {
		throw "wysiwyg.table.js depends on $.wysiwyg";
	}

	if (!$.wysiwyg.controls) {
		$.wysiwyg.controls = {};
	}

	var insertTable = function (colCount, rowCount, filler) {
		if (isNaN(rowCount) || isNaN(colCount) || rowCount === null || colCount === null) {
			return;
		}

		var i, j, html = ['<table border="1" style="width: 100%;"><tbody>'];

		colCount = parseInt(colCount, 10);
		rowCount = parseInt(rowCount, 10);

		if (filler === null) {
			filler = "&nbsp;";
		}
		filler = "<td>" + filler + "</td>";

		for (i = rowCount; i > 0; i -= 1) {
			html.push("<tr>");
			for (j = colCount; j > 0; j -= 1) {
				html.push(filler);
			}
			html.push("</tr>");
		}
		html.push("</tbody></table>");

		return this.insertHtml(html.join(""));
	};

	/*
	 * Wysiwyg namespace: public properties and methods
	 */
	$.wysiwyg.controls.table = function (Wysiwyg) {
		var self = Wysiwyg,
			formTableHtml = '<form class="wysiwyg"><fieldset><legend>Insert table</legend><label>Count of columns: <input type="text" name="colCount" value="3" /></label><label><br />Count of rows: <input type="text" name="rowCount" value="3" /></label><input type="submit" class="button" value="Insert table" /> <input type="reset" value="Cancel" /></fieldset></form>',
			dialog,
			colCount,
			rowCount;

		if (!Wysiwyg.insertTable) {
			Wysiwyg.insertTable = insertTable;
		}

		if ($.fn.modal) {
			$.modal(formTableHtml, {
				onShow: function (dialog) {
					$("input:submit", dialog.data).click(function (e) {
						e.preventDefault();
						rowCount = $('input[name="rowCount"]', dialog.data).val();
						colCount = $('input[name="colCount"]', dialog.data).val();

						self.insertTable(colCount, rowCount, self.defaults.tableFiller);
						$.modal.close();
					});
					$("input:reset", dialog.data).click(function (e) {
						e.preventDefault();
						$.modal.close();
					});
				},
				maxWidth: self.defaults.formWidth,
				maxHeight: self.defaults.formHeight,
				overlayClose: true
			});
		} else if ($.fn.dialog) {
			dialog = $(formTableHtml).appendTo("body");
			dialog.dialog({
				modal: true,
				width: self.defaults.formWidth,
				height: self.defaults.formHeight,
				open: function (event, ui) {
					$("input:submit", dialog).click(function (e) {
						e.preventDefault();
						rowCount = $('input[name="rowCount"]', dialog).val();
						colCount = $('input[name="colCount"]', dialog).val();

						self.insertTable(colCount, rowCount, self.defaults.tableFiller);
						$(dialog).dialog("close");
					});
					$("input:reset", dialog).click(function (e) {
						e.preventDefault();
						$(dialog).dialog("close");
					});
				},
				close: function (event, ui) {
					dialog.dialog("destroy");
				}
			});
		} else {
			colCount = prompt("Count of columns", "3");
			rowCount = prompt("Count of rows", "3");

			self.insertTable(colCount, rowCount, self.defaults.tableFiller);
		}

		$(self.editorDoc).trigger("wysiwyg:refresh");
	};

	$.wysiwyg.insertTable = function (object, colCount, rowCount, filler) {
		if ("object" !== typeof (object) || !object.context) {
			object = this;
		}

		if (!object.each) {
			console.error("Something goes wrong, check object");
		}

		return object.each(function () {
			var self = $(this).data("wysiwyg");

			if (!self.insertTable) {
				self.insertTable = insertTable;
			}

			if (!self) {
				return this;
			}

			self.insertTable(colCount, rowCount, filler);
			$(self.editorDoc).trigger("wysiwyg:refresh");

			return this;
		});
	};
})(jQuery);