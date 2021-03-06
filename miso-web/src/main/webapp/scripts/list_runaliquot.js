ListTarget.runaliquot = {
  name: "Library Aliquots",
  createUrl: function(config, projectId) {
    throw new Error("Can only be created statically");
  },
  getQueryUrl: null,
  createBulkActions: function(config, projectId) {
    return [{
      name: 'Set QC',
      action: function(aliquots) {
        var fields = [{
          label: 'Status',
          type: 'select',
          property: 'status',
          values: [{
            id: null,
            description: 'Pending'
          }].concat(Constants.runLibraryQcStatuses),
          getLabel: Utils.array.get('description')
        }, {
          label: 'Note',
          type: 'text',
          property: 'qcNote'
        }];
        Utils.showDialog('Set QC', 'OK', fields, function(output) {
          aliquots.forEach(function(aliquot) {
            aliquot.qcStatusId = output.status.id;
            aliquot.qcNote = output.qcNote ? output.qcNote : null;
          });
          Utils.ajaxWithDialog('Setting QC', 'PUT', Urls.rest.runs.updateAliquots(config.runId), aliquots, Utils.page.pageReload);
        });
      }
    }, {
      name: 'Set Purpose',
      action: function(aliquots) {
        Utils.showWizardDialog("Set Purpose", Constants.runPurposes.sort(Utils.sorting.standardSort('alias')).map(function(purpose) {
          return {
            name: purpose.alias,
            handler: function() {
              aliquots.forEach(function(aliquot) {
                aliquot.runPurposeId = purpose.id;
              });
              Utils.ajaxWithDialog('Setting Purpose', 'PUT', Urls.rest.runs.updateAliquots(config.runId), aliquots, Utils.page.pageReload);
            }
          }
        }));
      }
    }];
  },
  createStaticActions: function(config, projectId) {
    return [];
  },
  createColumns: function(config, projectId) {
    return [ListUtils.labelHyperlinkColumn("Container", Urls.ui.containers.edit, function(item) {
      return item.containerId;
    }, "containerIdentificationBarcode", 2, true), {
      sTitle: "Partition",
      mData: "partitionNumber",
      include: true,
      iSortPriority: 1,
      bSortDirection: true
    }, ListUtils.labelHyperlinkColumn("Name", Urls.ui.libraryAliquots.edit, function(item) {
      return item.aliquotId;
    }, "aliquotName", 0, true), ListUtils.labelHyperlinkColumn("Alias", Urls.ui.libraryAliquots.edit, function(item) {
      return item.aliquotId;
    }, "aliquotAlias", 0, true), {
      sTitle: "QC Status",
      mData: "qcStatusId",
      mRender: ListUtils.render.textFromId(Constants.runLibraryQcStatuses, 'description', 'Pending')
    }, {
      sTitle: "QC Note",
      mData: 'qcNote',
      sDefaultContent: ''
    }, {
      sTitle: 'QC User',
      mData: 'qcUserName',
      sDefaultContent: 'n/a'
    }, {
      sTitle: 'QC Date',
      mData: 'qcDate',
      sDefaultContent: 'n/a'
    }, {
      sTitle: 'Hierarchy',
      mData: function(full) {
        return full.runId + '-' + full.partitionId + '-' + full.aliquotId;
      },
      mRender: function(data, type, full) {
        if (type === 'display') {
          return '<a href="' + Urls.ui.runLibraries.qcHierarchy(data) + '">View</a>'
        }
        return data;
      }
    }, {
      sTitle: "Purpose",
      mData: "runPurposeId",
      include: true,
      iSortPriority: 0,
      mRender: ListUtils.render.textFromId(Constants.runPurposes, 'alias', '(Unset)')
    }];
  }
};
