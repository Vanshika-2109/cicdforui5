sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, Fragment, JSONModel, Filter, FilterOperator) {
		"use strict";

		return Controller.extend("com.yash.assignment8.controller.App", {
			onInit: function () {
                this.selectedModel = new JSONModel({
				"Suppliers": []
                });
                this.getView().setModel(this.selectedModel, "selectedModel");

                var oModel = new JSONModel("model/Supplier.json");
                this.getView().setModel(oModel, "myModel");
            },
            handleNav: function(evt) {
			var navCon = this.byId("navCon");
			var target = evt.getSource().data("target");
			if (target) {
				var animation = "flip"
				navCon.to(this.byId(target), animation);
			} else {
				navCon.back();
            }
        },
        onEmployeePressed: function(oEvent){
            var oList= this.getView().byId("ordersList");
            var path = oEvent.getSource().getBindingContext().getPath();
            this.getView().byId("ordersList").bindElement({
                    path: oEvent.getSource().getBindingContext().getPath(),
                    parameters : {
                            expand : "Orders"
                            }
                })
        },
        onOrdersPressed: function(oEvent){
            this.getView().byId("ordersDetailList").bindElement({
                    path: oEvent.getSource().getBindingContext().getPath(),
                    parameters : {
                            expand : "Order_Details"
                            }
                })
        },
        onCustomerListPress: function(oEvent){
            this.getView().byId("objectPageLayout").bindElement({
                    path: oEvent.getSource().getBindingContext().getPath()
            })
        },
        onProductgridpressed: function(oEvent){
            var oPopover = this._getPopoverProducts();
                var oSource = oEvent.getSource();   
                oPopover.bindElement(oSource.getBindingContext().getPath());
                //this.oPopover.bindElement
                oPopover.openBy(oSource);
            },
            _getPopoverProducts : function () {
                // create dialog lazily
	            if (!this._oPopover) {
		        // create popover via fragment factory
		        this._oPopover = sap.ui.xmlfragment(
		        "com.yash.assignment8.fragments.ProductPopover", this);
		        this.getView().addDependent(this._oPopover);
	            }
	            return this._oPopover;
            },
            onSupplierDialogPress: function(oEvent){
                if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.yash.assignment8.fragments.SupplierPopover", this);
			}
			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);

			this.getView().addDependent(this._oDialog);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();   
            },
            onUpdateEmployee: function(){
                var oList = this.getView().byId("employeelist");
                var oItemsBinding = oList.getBinding("items");
                var oItemLength = oItemsBinding.getLength();
                this.getView().byId("totalEmployee").setTitle("Total Employee: " + oItemLength);
            },
            onOrderUpdated: function(){
                var oList = this.getView().byId("ordersList");
                var oItemsBinding = oList.getBinding("items");
                var oItemLength = oItemsBinding.getLength();
                this.getView().byId("totalOrders").setTitle("Total Orders: " + oItemLength);
            },
            onOrderDetailUpdate: function(){
                var oList = this.getView().byId("ordersDetailList");
                var oItemsBinding = oList.getBinding("items");
                var oItemLength = oItemsBinding.getLength();
                this.getView().byId("totalorderDetail").setTitle("Order Details: " + oItemLength);
            },
            onEmployeeSearch: function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getParameter("query");

                if(sQuery){
                   aFilters.push(new Filter("FirstName", FilterOperator.Contains, sQuery));
                }

                var oList = this.byId("employeelist");
                var oBinding = oList.getBinding("items");

                oBinding.filter(aFilters);
            },
            onOrdersSearch: function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getParameter("query");

                if(sQuery){
                   aFilters.push(new Filter("CustomerID", FilterOperator.Contains, sQuery));
                }

                var oList = this.byId("ordersList");
                var oBinding = oList.getBinding("items");

                oBinding.filter(aFilters);
            },
            onOrderDetailSearch: function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getParameter("query").toString();
                var productId = "ProductID".toString();
                console.log(productId);
                if(sQuery){
                   aFilters.push(new Filter(productId, FilterOperator.Contains, sQuery));
                }

                var oList = this.byId("ordersDetailList");
                var oBinding = oList.getBinding("items");

                oBinding.filter(aFilters);
            },
            handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("SupplierID", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleClose: function (oEvent) {
			var data = this.getView().getModel("selectedModel").getData();
			var aContexts = oEvent.getParameter("selectedContexts");
			var flag = false;
			if (aContexts && aContexts.length) {
				aContexts.forEach(function (oContext) {
					flag = false;
					var supplier = oContext.getObject();
					//if (data.Suppliers.indexOf(supplier) == -1) {
					for (var i = 0; i < data.Suppliers.length; i++) {
						if (supplier.SupplierID == data.Suppliers[i].SupplierID) {
							flag = true;
						}
					}
					if (!flag) {
						data.Suppliers.push(supplier);
					}
				});
			}
			this.getView().getModel("selectedModel").setData(data);
		},
	});
});
