import type { AppLocale } from "./locales";

export type TranslationKey =
  | "app.skip"
  | "app.workspace"
  | "app.excelConnected"
  | "app.browserPreview"
  | "app.website"
  | "app.booting"
  | "app.bootSkeletonAria"
  | "app.crashTitle"
  | "app.crashLead"
  | "app.crashReload"
  | "app.crashAria"
  | "app.description"
  | "app.selection"
  | "app.documents"
  | "app.results"
  | "app.status"
  | "app.none"
  | "app.ready"
  | "app.language"
  | "app.langSwitch"
  | "app.langSwitchAria"
  | "cloud.session"
  | "cloud.email"
  | "cloud.otp"
  | "cloud.sendCode"
  | "cloud.verifyCode"
  | "cloud.otpHint"
  | "cloud.backToEmail"
  | "cloud.login"
  | "cloud.register"
  | "cloud.logout"
  | "cloud.failed"
  | "cloud.skipped"
  | "cloud.invalid"
  | "cloud.invalidCode"
  | "cloud.otpNotLive"
  | "cloud.userNotFound"
  | "cloud.emailTaken"
  | "cloud.cooldown"
  | "cloud.signedIn"
  | "cloud.backup"
  | "cloud.mail"
  | "cloud.backupOk"
  | "cloud.mailOk"
  | "cloud.backupFailed"
  | "cloud.mailFailed"
  | "cloud.noEvidence"
  | "cloud.restore"
  | "cloud.restoreOk"
  | "cloud.restoreFailed"
  | "cloud.templates"
  | "cloud.templatesNotLive"
  | "cloud.templatesFailed"
  | "cloud.firmRole"
  | "cloud.firmRoleLocal"
  | "cloud.firmAccessNotLive"
  | "cloud.mfa"
  | "cloud.mfaNotLive"
  | "cloud.assist"
  | "cloud.assistNotLive"
  | "cloud.assistGovernance"
  | "cloud.admin"
  | "cloud.adminRoster"
  | "cloud.adminDeploy"
  | "cloud.adminNotLive"
  | "cloud.adminFailed"
  | "pbc.uploadToImport"
  | "pbc.markReceived"
  | "pbc.received"
  | "pbc.todHint"
  | "pbc.listOnlyHint"
  | "pbc.kicker"
  | "pbc.title"
  | "pbc.subtitle"
  | "pbc.statPending"
  | "pbc.statUploaded"
  | "pbc.statApproved"
  | "pbc.checklist"
  | "pbc.idLabel"
  | "pbc.deadlineLabel"
  | "pbc.uploadedFile"
  | "pbc.approve"
  | "pbc.reject"
  | "pbc.removeFile"
  | "pbc.statusPending"
  | "pbc.statusUploaded"
  | "pbc.statusApproved"
  | "pbc.statusRejected"
  | "pbc.catAccountsPayable"
  | "pbc.catCashBank"
  | "pbc.catExpenses"
  | "pbc.catFixedAssets"
  | "pbc.catGovernance"
  | "pbc.whatTitle"
  | "pbc.whatBody"
  | "tb.importTb"
  | "tb.importListing"
  | "tb.sendToMatching"
  | "tb.pickLead"
  | "tb.tieOutOk"
  | "tb.tieOutWarn"
  | "tb.parseFailed"
  | "tb.sendHint"
  | "tb.selectAll"
  | "tb.listingEmpty"
  | "tb.kicker"
  | "tb.title"
  | "tb.subtitle"
  | "tb.balanceOk"
  | "tb.balanceWarn"
  | "tb.balanceHint"
  | "tb.debits"
  | "tb.credits"
  | "tb.mappings"
  | "tb.searchPlaceholder"
  | "tb.colCode"
  | "tb.colDescription"
  | "tb.colDebit"
  | "tb.colCredit"
  | "tb.colMapping"
  | "tb.colInvoice"
  | "tb.colDate"
  | "tb.colAmount"
  | "tb.guidelinesTitle"
  | "results.sendToWorkpapers"
  | "wp.signFile"
  | "wp.fileHint"
  | "wp.unsignedHint"
  | "wp.followUpWarn"
  | "wp.snipCount"
  | "wp.noSnips"
  | "wp.minutesTitle"
  | "wp.minutesEmpty"
  | "wp.kicker"
  | "wp.title"
  | "wp.subtitle"
  | "wp.feedbackKicker"
  | "wp.feedbackTitle"
  | "wp.feedbackSubtitle"
  | "wp.notesCount"
  | "wp.assigned"
  | "wp.workpaperLabel"
  | "wp.reviewerLabel"
  | "wp.responseLabel"
  | "wp.respond"
  | "wp.clearClose"
  | "wp.cancel"
  | "wp.submit"
  | "wp.responsePlaceholder"
  | "wp.statusNotStarted"
  | "wp.statusInProgress"
  | "wp.statusReadyForReview"
  | "wp.statusApproved"
  | "wp.noteOpen"
  | "wp.noteResponded"
  | "wp.noteClosed"
  | "app.browserWarning"
  | "project.kicker"
  | "project.title"
  | "project.description"
  | "project.invoiceTitle"
  | "project.invoiceBody"
  | "project.statementTitle"
  | "project.statementBody"
  | "results.kicker"
  | "results.title"
  | "results.description"
  | "results.exportCsv"
  | "results.rows"
  | "results.showingRows"
  | "results.loadMore"
  | "results.matched"
  | "results.partial"
  | "results.exception"
  | "results.confidence"
  | "results.discrepancy"
  | "results.row"
  | "results.score"
  | "results.invoiceEvidence"
  | "results.bankEvidence"
  | "results.noLinkedSource"
  | "results.inspectTrace"
  | "results.noResults"
  | "results.noResultsDescription"
  | "results.busySkeletonAria"
  | "results.clearlyTrivial"
  | "results.belowPerformance"
  | "results.materialException"
  | "results.aboveOverall"
  | "results.unassessed"
  | "results.discrepancyAmount"
  | "results.materialityAssessment"
  | "status.matched"
  | "status.partial"
  | "status.exception"
  | "nav.matching"
  | "nav.engagements"
  | "nav.trialBalance"
  | "nav.workpapers"
  | "nav.clientPortal"
  | "eng.title"
  | "eng.kicker"
  | "eng.new"
  | "eng.clientName"
  | "eng.financialYear"
  | "eng.framework"
  | "eng.status"
  | "eng.create"
  | "eng.cancel"
  | "eng.team"
  | "eng.partner"
  | "eng.manager"
  | "eng.senior"
  | "eng.associate"
  | "eng.progress"
  | "eng.workpapers"
  | "eng.reviewNotes"
  | "eng.pbcRequests"
  | "eng.delete"
  | "eng.eqReviewer"
  | "eng.overallMateriality"
  | "eng.performanceMateriality"
  | "eng.trivialThreshold"
  | "eng.lock"
  | "eng.unlock"
  | "eng.locked"
  | "eng.unlocked"
  | "eng.wizard.title"
  | "eng.wizard.step1"
  | "eng.wizard.step2"
  | "eng.wizard.step3"
  | "eng.wizard.step4"
  | "eng.wizard.next"
  | "eng.wizard.back"
  | "eng.wizard.finish"
  | "eng.wizard.progress"
  | "eng.placeholder.clientExample"
  | "eng.placeholder.epName"
  | "eng.placeholder.emName"
  | "eng.placeholder.seniorInCharge"
  | "eng.placeholder.associate"
  | "eng.placeholder.eqReviewer"
  | "eng.placeholder.iso"
  | "eng.placeholder.partner"
  | "eng.placeholder.manager"
  | "eng.placeholder.senior"
  | "workflow.kicker"
  | "workflow.title"
  | "workflow.desc"
  | "workflow.step1Title"
  | "workflow.step1Desc"
  | "workflow.step2Title"
  | "workflow.step2Desc"
  | "workflow.step3Title"
  | "workflow.step3Desc"
  | "workflow.step4Title"
  | "workflow.step4Desc"
  | "workflow.step1Short"
  | "workflow.step2Short"
  | "workflow.step3Short"
  | "workflow.step4Short"
  | "firstrun.body"
  | "firstrun.gotIt"
  | "firstrun.skip"
  | "app.working"
  | "app.enabled"
  | "app.disabled"
  | "app.preview"
  | "app.remove"
  | "app.yes"
  | "app.no"
  | "app.notice"
  | "app.success"
  | "app.error"
  | "selection.step"
  | "selection.title"
  | "selection.headersTitle"
  | "selection.headersDesc"
  | "selection.address"
  | "selection.sheet"
  | "selection.rowsCount"
  | "selection.columnsCount"
  | "selection.col"
  | "selection.showingSubset"
  | "selection.emptyState"
  | "selection.captureBtn"
  | "import.step"
  | "import.title"
  | "import.desc"
  | "import.invoiceEvidence"
  | "import.invoiceDesc"
  | "import.browseInvoices"
  | "import.bankStatements"
  | "import.bankDesc"
  | "import.browseBank"
  | "import.jsonSupportTitle"
  | "import.jsonSupportDesc"
  | "import.busySkeletonAria"
  | "import.invoiceLibrary"
  | "import.bankLibrary"
  | "import.pageImported"
  | "import.docCount"
  | "import.fileCount"
  | "import.id"
  | "import.amount"
  | "import.date"
  | "import.jsonSource"
  | "import.emptyState"
  | "import.rename"
  | "import.download"
  | "import.downloadStoredHint"
  | "import.downloadFailed"
  | "import.downloadHostUnconfirmed"
  | "import.renameInvalid"
  | "import.renameSessionOnly"
  | "import.busyInvoice"
  | "import.busyBank"
  | "import.activityInvoice"
  | "import.activityBank"
  | "import.activitySelected"
  | "import.activityImported"
  | "import.activityNone"
  | "import.activityImportedDesc"
  | "import.activityNoneDesc"
  | "import.summarySuccessTitle"
  | "import.summarySuccessDesc"
  | "import.summaryNoneTitle"
  | "import.summaryNoneDesc"
  | "import.summaryMixedTitle"
  | "import.summaryMixedDesc"
  | "import.parseFailedTitle"
  | "import.parseFailedDesc"
  | "import.unsupportedType"
  | "import.failedTitle"
  | "import.failedDesc"
  | "import.statusParsed"
  | "import.statusError"
  | "import.statusParsing"
  | "import.statusIdle"
  | "config.step"
  | "config.title"
  | "config.desc"
  | "config.suggested"
  | "config.sourceColumns"
  | "config.amountCol"
  | "config.dateCol"
  | "config.refCol"
  | "config.selectCol"
  | "config.matchingLogic"
  | "config.amountTol"
  | "config.amountTolPercent"
  | "config.dateTol"
  | "config.scoreWeights"
  | "config.scoreWeightsHint"
  | "config.weightInvoice"
  | "config.weightAmount"
  | "config.weightDate"
  | "config.requireInvoice"
  | "config.allowFuzzy"
  | "config.outputFields"
  | "config.enabledCount"
  | "config.excelMapping"
  | "config.targets"
  | "config.writesInto"
  | "config.selectTarget"
  | "config.emptyState"
  | "config.readyMatch"
  | "config.loadedSummary"
  | "config.matchActive"
  | "config.matchAll"
  | "config.identityTitle"
  | "config.preparer"
  | "config.reviewer"
  | "config.preparerPlaceholder"
  | "config.reviewerPlaceholder"
  | "config.out.invoiceDocument"
  | "config.out.invoiceAmount"
  | "config.out.invoiceDate"
  | "config.out.invoiceNumber"
  | "config.out.bankDocument"
  | "config.out.bankAmount"
  | "config.out.bankDate"
  | "config.out.bankReference"
  | "config.out.status"
  | "config.out.confidence"
  | "results.clear"
  | "results.rematch"
  | "results.signOff"
  | "results.signOffComment"
  | "results.signOffCommentPlaceholder"
  | "results.conclude"
  | "results.waive"
  | "results.followUp"
  | "results.signedOff"
  | "results.rowLocked"
  | "identity.requiredTitle"
  | "identity.requiredDescription"
  | "identity.sameNameTitle"
  | "identity.sameNameDescription"
  | "identity.saveFailed"
  | "results.signOffSuccessTitle"
  | "results.signOffSuccessDescription"
  | "results.lockedRematchTitle"
  | "results.lockedRematchDescription"
  | "results.averageConfidence"
  | "results.discrepancyCount"
  | "activity.kicker"
  | "activity.title"
  | "activity.desc"
  | "activity.events"
  | "activity.emptyState"
  | "activity.justNow"
  | "viewer.kicker"
  | "viewer.title"
  | "viewer.desc"
  | "viewer.noPreview"
  | "viewer.expand"
  | "viewer.collapse"
  | "viewer.backToWorkflow"
  | "viewer.zoomFit"
  | "viewer.zoomOut"
  | "viewer.zoomIn"
  | "viewer.zoomLabel"
  | "viewer.snipModeOn"
  | "viewer.snipModeOff"
  | "viewer.snipModeOnTitle"
  | "viewer.snipModeOffTitle"
  | "viewer.onPage"
  | "viewer.snipHint"
  | "viewer.activeSnip"
  | "viewer.linkToCell"
  | "viewer.linkToCellTitle"
  | "viewer.removeSnip"
  | "viewer.emptyState"
  | "viewer.pdfFailed"
  | "viewer.fileNotFound"
  | "viewer.extractedSnippet"
  | "viewer.manualSnip"
  | "viewer.imageRegion"
  | "viewer.imageRegionHint"
  | "snips.kicker"
  | "snips.title"
  | "snips.desc"
  | "snips.statCaptured"
  | "snips.statLinked"
  | "snips.statOpen"
  | "snips.emptyState"
  | "snips.goToPage"
  | "snips.linked"
  | "snips.needsLink"
  | "snips.linkAnother"
  | "snips.linkCell"
  | "snips.unlinkCell"
  | "snips.linkTooltip"
  | "snips.removeTooltip"
  | "snips.sourcePdfWord"
  | "snips.sourcePdfLine"
  | "snips.sourcePdfTable"
  | "snips.sourcePdfText"
  | "snips.sourceManualRegion"
  | "snips.sourceExtractedSnippet"
  | "snips.sourceGeneric"
  | "snips.formFieldNone"
  | "snips.formFieldInvoiceNumber"
  | "snips.formFieldDate"
  | "snips.formFieldAmount"
  | "snips.formFieldReference"
  | "snips.formFieldOther"
  | "snips.writeForm"
  | "snips.writeFormTooltip"
  | "snips.formMixedDocuments"
  | "snips.formEmptyTags"
  | "templates.kicker"
  | "templates.title"
  | "templates.desc"
  | "templates.setups"
  | "templates.nameLabel"
  | "templates.placeholder"
  | "templates.saving"
  | "templates.save"
  | "templates.export"
  | "templates.importLabel"
  | "templates.savedLibrary"
  | "templates.deleteTooltip"
  | "templates.tol"
  | "templates.window"
  | "templates.fields"
  | "templates.apply"
  | "templates.emptyTitle"
  | "templates.emptyDesc"
  | "eng.planningScope"
  | "eng.selectEngagementPrompt"
  | "eng.deleteTitle"
  | "eng.deleteDesc"
  | "eng.deleteBtn"
  | "eng.cancelBtn"
  | "eng.listTitle"
  | "eng.fw.isa"
  | "eng.fw.ias_ifrs"
  | "eng.fw.ifrs_smes"
  | "eng.status.notStarted"
  | "eng.status.inProgress"
  | "eng.status.pendingClient"
  | "eng.status.underReview"
  | "eng.status.clearedPartner"
  | "eng.status.completed"
  | "eng.status.archived"
  | "app.prev"
  | "app.next"
  | "viewer.liveInspection"
  | "viewer.renderingPdf"
  | "viewer.busySkeletonAria"
  | "viewer.detectedMetadata"
  | "viewer.invoiceNum"
  | "viewer.amountVal"
  | "viewer.dateVal"
  | "viewer.statementEntries"
  | "viewer.relevantSnippets"
  | "viewer.captureSnippet"
  | "viewer.snipBtn"
  | "eng.clientRequired"
  | "eng.createdSuccess"
  | "eng.deletedSuccess"
  | "eng.responded"
  | "eng.closed"
  | "eng.pbc.uploaded"
  | "eng.pbc.approved"
  | "eng.currency"
  | "eng.currencyOther"
  | "eng.currencyInvalid"
  | "eng.ocrLanguage"
  | "eng.ocrMyanmarEnglish"
  | "eng.ocrEnglish"
  | "eng.reportingSaveFailed"
  | "snip.undo"
  | "snip.undone"
  | "snip.undoExpired"
  | "snip.tableLinked"
  | "snip.tableReplaced"
  | "snip.formLinked"
  | "snip.formReplaced"
  | "snip.tableDetectFailed"
  | "snip.noTextLayer"
  | "snip.mergedDestination"
  | "snip.undoSessionWeak"
  | "viewer.fieldLocationUnavailable"
  | "persist.sessionCacheFailedTitle"
  | "persist.sessionCacheFailedDesc"
  | "persist.evidenceOpenFailedTitle"
  | "persist.evidenceOpenFailedDesc"
  | "persist.evidenceNotStoredTitle"
  | "persist.evidenceNotStoredWorkbookDesc"
  | "persist.evidenceNotStoredIdbDesc"
  | "persist.workbookEmbedFailedTitle"
  | "persist.workbookEmbedFailedDesc"
  | "persist.templatesLoadFailedTitle"
  | "persist.templatesLoadFailedFallback"
  | "persist.auditLogLoadFailedTitle"
  | "persist.auditLogLoadFailedFallback"
  | "persist.fileTooLargeTitle"
  | "persist.fileTooLargeDesc"
  | "persist.workbookEmbedUnavailableTitle"
  | "persist.workbookEmbedUnavailableDesc"
  | "persist.workbookEvidenceRemoveFailedTitle"
  | "persist.workbookEvidenceRemoveFailedFallback"
  | "persist.evidenceFileMissingTitle"
  | "persist.evidenceFileMissingDesc"
  | "persist.parseCacheMissingTitle"
  | "persist.parseCacheMissingDesc"
  | "persist.workbookEvidenceReadFailedTitle"
  | "persist.workbookEvidenceReadFailedFallback"
  | "persist.snipAnchorsRestoreFailedTitle"
  | "persist.snipAnchorsRestoreFailedFallback"
  | "persist.evidenceCacheSaveFailedTitle"
  | "persist.evidenceCacheSaveFailedDesc"
  | "persist.engagementSaveFailedTitle"
  | "persist.engagementSaveFailedDesc"
  | "match.sampleRequiredTitle"
  | "match.sampleRequiredMappingDesc"
  | "match.sampleRequiredTbDesc"
  | "match.mappingAppliedTitle"
  | "match.mappingAppliedDesc"
  | "match.excelContextTitle"
  | "match.excelContextCaptureDesc"
  | "match.selectionCapturedTitle"
  | "match.selectionCapturedDesc"
  | "match.selectionFailedTitle"
  | "match.selectionFailedFallback"
  | "match.tbSampleReadyTitle"
  | "match.tbSampleReadyDesc"
  | "match.noSampleTitle"
  | "match.noSampleDocsDesc"
  | "match.noSampleDesc"
  | "match.noEvidenceTitle"
  | "match.noEvidenceRunDesc"
  | "match.noEvidenceDesc"
  | "match.noOutputTitle"
  | "match.noOutputDesc"
  | "match.outputIncompleteTitle"
  | "match.outputIncompleteBeforeDesc"
  | "match.outputIncompleteDesc"
  | "match.outputDuplicateTitle"
  | "match.outputDuplicateDesc"
  | "match.completedTitle"
  | "match.completedDesc"
  | "match.failedTitle"
  | "match.failedFallback"
  | "match.rowNotFoundTitle"
  | "match.rowNotFoundDesc"
  | "match.rowMatchedTitle"
  | "match.rowMatchedDesc"
  | "match.rowFailedTitle"
  | "match.excelConnectionTitle"
  | "match.excelConnectionDesc"
  | "match.outOfBoundsTitle"
  | "match.outOfBoundsDesc"
  | "match.activeRowFailedTitle"
  | "match.activeRowFailedFallback"
  | "match.clearedTitle"
  | "match.clearedExcelDesc"
  | "match.clearedUiDesc"
  | "match.clearFailedTitle"
  | "match.clearFailedFallback"
  | "wp.sendBlockedTitle"
  | "wp.sendBlockedDesc"
  | "wp.matchRequiredTitle"
  | "wp.matchRequiredDesc"
  | "wp.packReadyTitle"
  | "wp.packReadyDesc"
  | "wp.signBlockedTitle"
  | "wp.signBlockedLockedDesc"
  | "wp.signBlockedReviewDesc"
  | "wp.signedTitle"
  | "wp.signedDesc"
  | "results.signOffExceptionOnly"
  | "results.signOffLogFailedTitle"
  | "results.signOffLogFailedFallback"
  | "template.savedTitle"
  | "template.savedDesc"
  | "template.appliedTitle"
  | "template.appliedDesc"
  | "template.deletedTitle"
  | "template.deletedFallback"
  | "template.exportedTitle"
  | "template.exportedDesc"
  | "template.importedTitle"
  | "template.importedDesc"
  | "template.importFailedTitle"
  | "template.importFailedFallback"
  | "snip.emptyIgnoredTitle"
  | "snip.emptyIgnoredDesc"
  | "snip.alreadyCapturedTitle"
  | "snip.alreadyCapturedDesc"
  | "snip.addFailedTitle"
  | "snip.undoFailedTitle"
  | "snip.undoFailedFallback"
  | "snip.excelContextLinkDesc"
  | "snip.linkFailedTitle"
  | "snip.linkFailedNoDocument"
  | "snip.linkFailedFallback"
  | "snip.formWriteFailedTitle"
  | "snip.formWriteFailedFallback"
  | "snip.replacedTitle"
  | "snip.linkedTitle"
  | "snip.linkedSessionTitle"
  | "snip.replacedDesc"
  | "snip.linkedDesc"
  | "snip.hostNoBindingsCells"
  | "snip.hostNoBindingsCell"
  | "snip.hashMissingAnchor"
  | "snip.hostTopLeftOnly"
  | "snip.sessionKeepCellsFallback"
  | "snip.sessionKeepCellFallback"
  | "app.runtimeError"
  | "app.unhandledRejection"
  | "identity.readFailedFallback"
  | "identity.saveFailedFallback"
  | "eng.reportingReadFailedFallback"
  | "eng.reportingSaveFailedFallback"
  | "activity.sessionCacheFailedDesc"
  | "activity.evidenceNotStoredBothDesc"
  | "activity.evidenceNotStoredIdbDesc"
  | "activity.templatesLoadedTitle"
  | "activity.templatesLoadedDesc"
  | "activity.templatesFailedTitle"
  | "activity.mappingBlockedTitle"
  | "activity.mappingBlockedDesc"
  | "activity.mappingAppliedDesc"
  | "activity.selectionBlockedTitle"
  | "activity.selectionBlockedDesc"
  | "activity.capturingSelectionTitle"
  | "activity.selectionCapturedDesc"
  | "activity.selectionCapturedEmptyTitle"
  | "activity.selectionCapturedEmptyDesc"
  | "activity.tbBlockedTitle"
  | "activity.tbBlockedDesc"
  | "activity.tbSentTitle"
  | "activity.tbSentDesc"
  | "activity.todBlockedTitle"
  | "activity.todBlockedLockedDesc"
  | "activity.todBlockedNoResultsDesc"
  | "activity.todSentTitle"
  | "activity.todSentDesc"
  | "activity.signBlockedLockedDesc"
  | "activity.signBlockedUnsignedDesc"
  | "activity.workpaperFileSignedTitle"
  | "activity.identityPairDesc"
  | "activity.fileTooLargeDesc"
  | "activity.invoicePickerDismissed"
  | "activity.bankPickerDismissed"
  | "activity.evidenceRemovedTitle"
  | "activity.matchBlockedTitle"
  | "activity.matchBlockedNoSampleDesc"
  | "activity.matchBlockedNoEvidenceDesc"
  | "activity.matchBlockedNoOutputDesc"
  | "activity.matchBlockedIncompleteDesc"
  | "activity.matchBlockedDuplicateDesc"
  | "activity.matchingRunningTitle"
  | "activity.matchingRunningDesc"
  | "activity.workerFallbackTitle"
  | "activity.matchingCompletedDesc"
  | "activity.singleRowRunningTitle"
  | "activity.singleRowRunningDesc"
  | "activity.rowMatchedDesc"
  | "activity.matchClearedDesc"
  | "activity.signOffRowDesc"
  | "activity.templatesImportedDesc"
  | "activity.viewerFocusedTitle"
  | "activity.viewerFocusedFallback"
  | "activity.duplicateSnipTitle"
  | "activity.duplicateSnipDesc"
  | "activity.textSnippedTitle"
  | "activity.textSnippedDesc"
  | "activity.ocrActiveTitle"
  | "activity.ocrActiveDesc"
  | "activity.ocrExtractedTitle"
  | "activity.ocrExtractedDesc"
  | "activity.ocrFailedTitle"
  | "activity.ocrFailedDesc"
  | "activity.snipUndoneTitle"
  | "activity.tableSnipLinkedTitle"
  | "activity.formFieldsWrittenTitle"
  | "activity.snipReplacedTitle"
  | "activity.snipLinkedToCellTitle"
  | "activity.snipModeOnTitle"
  | "activity.snipModeOffTitle"
  | "activity.snipModeOnDesc"
  | "activity.snipModeOffDesc"
  | "activity.snipFocusedTitle"
  | "activity.snipFocusedDesc"
  | "activity.snipRemovedTitle"
  | "activity.snipLinkRemovedTitle"
  | "activity.sessionRestoredTitle"
  | "activity.sessionRestoredDesc"
  | "app.officeBootstrapFallback"
  | "app.officeReadyFailedFallback";

const translations: Record<AppLocale, Record<TranslationKey, string>> = {
  "my-MM": {
    "app.skip": "အဓိကအကြောင်းအရာသို့ ကျော်သွားရန်",
    "app.workspace": "Excel စာရင်းစစ်လုပ်ငန်းခွင်",
    "app.excelConnected": "Excel ချိတ်ဆက်ပြီး",
    "app.browserPreview": "Browser preview",
    "app.website": "Website",
    "app.booting": "စတင်နေသည်",
    "app.bootSkeletonAria": "Office စတင်နေဆဲဖြစ်သည်",
    "app.crashTitle": "တစ်ခုခု မှားယွင်းသွားသည်",
    "app.crashLead":
      "Workbook ထဲတွင် Matching ကျန်ရှိနိုင်သည်။ ဤ pane ကို reload လုပ်ပါ။",
    "app.crashReload": "Pane ကို reload လုပ်ရန်",
    "app.crashAria": "Task pane တွင် အမှား ဖြစ်ပွားသည်",
    "app.description":
      "Excel အတွင်း Substantive Test of Details စစ်ဆေးမှုများအတွက် အချက်အလက် တိုက်ဆိုင်စစ်ဆေးပေးသည့် စနစ် ဖြစ်သည်။",
    "app.selection": "စာရင်းရွေးချယ်မှု",
    "app.documents": "သက်သေခံ စာရွက်စာတမ်းများ",
    "app.results": "တိုက်ဆိုင်စစ်ဆေးမှု ရလဒ်များ",
    "app.status": "လုပ်ငန်း အခြေအနေ",
    "app.none": "မရွေးရသေးပါ",
    "app.ready": "အသင့်ဖြစ်ပါပြီ",
    "app.language": "ဘာသာစကား",
    "app.langSwitch": "EN",
    "app.langSwitchAria": "Switch to English",
    "cloud.session": "အကောင့်",
    "cloud.email": "အီးမေးလ်",
    "cloud.otp": "ကုဒ်",
    "cloud.sendCode": "ကုဒ်ပို့မည်",
    "cloud.verifyCode": "ကုဒ်အတည်ပြုမည်",
    "cloud.otpHint": "မေးလ်မလှုပ်သေးသ၍ 123456 ကို သုံးပါ။",
    "cloud.backToEmail": "အီးမေးလ်သို့ ပြန်ရန်",
    "cloud.login": "ဝင်မည်",
    "cloud.register": "အကောင့်ဖွင့်မည်",
    "cloud.logout": "ထွက်မည်",
    "cloud.failed": "ဆက်သွယ်၍ မရပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "cloud.skipped": "API URL မရှိသေးပါ။",
    "cloud.invalid": "အီးမေးလ် ထည့်ပါ။",
    "cloud.invalidCode": "ဂဏန်း ၆ လုံး ကုဒ် ထည့်ပါ။",
    "cloud.otpNotLive": "OTP မေးလ် မလှုပ်သေးပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "cloud.userNotFound": "ဤအီးမေးလ်ဖြင့် အကောင့် မရှိသေးပါ။",
    "cloud.emailTaken": "ဤအီးမေးလ်ဖြင့် အကောင့် ရှိပြီးသား။",
    "cloud.cooldown": "ခဏစောင့်ပြီး ထပ်ပို့ပါ။",
    "cloud.signedIn": "ဝင်ရောက်ထားသည်",
    "cloud.backup": "အရန်သိမ်းမည်",
    "cloud.mail": "အကြောင်းကြားစာ",
    "cloud.backupOk": "အရန်သိမ်းပြီးပါပြီ။",
    "cloud.mailOk": "အကြောင်းကြားစာ ပို့ပြီးပါပြီ။",
    "cloud.backupFailed": "အရန်သိမ်း၍ မရပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "cloud.mailFailed": "အီးမေးလ် ပို့၍ မရပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "cloud.noEvidence": "သိမ်းရန် စာရွက်စာတမ်း မရှိသေးပါ။",
    "cloud.restore": "ပြန်ယူမည်",
    "cloud.restoreOk": "ပြန်ယူပြီးပါပြီ။",
    "cloud.restoreFailed":
      "Cloud မှ ပြန်ယူ၍ မရပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "cloud.templates": "ပုံစံခွက်များ",
    "cloud.templatesNotLive":
      "အဖွဲ့ ပုံစံခွက် sync မလှုပ်သေးပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "cloud.templatesFailed":
      "ပုံစံခွက် sync မရပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "cloud.firmRole": "Firm role",
    "cloud.firmRoleLocal": "စက်တွင်း လုပ်ကိုင်သူ",
    "cloud.firmAccessNotLive":
      "Firm roles မလှုပ်သေးပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "cloud.mfa": "MFA",
    "cloud.mfaNotLive": "MFA မလှုပ်သေးပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "cloud.assist": "AI assist",
    "cloud.assistNotLive":
      "AI assist မလှုပ်သေးပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "cloud.assistGovernance":
      "လှုပ်လာလျှင် ရလဒ်များကို ပြန်စစ်နိုင်၊ မှတ်တမ်းတင်၊ ပြင်နိုင်သည်။",
    "cloud.admin": "Admin",
    "cloud.adminRoster": "Roster",
    "cloud.adminDeploy": "Deploy",
    "cloud.adminNotLive":
      "Admin roster နှင့် deploy မလှုပ်သေးပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "cloud.adminFailed": "Admin console မရပါ။ Matching ကို ဆက်သုံးနိုင်သည်။",
    "pbc.uploadToImport": "Import သို့ တင်မည်",
    "pbc.markReceived": "လက်ခံပြီးဟု မှတ်မည်",
    "pbc.received": "လက်ခံပြီး",
    "pbc.todHint": "PDF၊ ပုံ၊ သို့မဟုတ် JSON ကို Matching Import သို့ ပို့သည်။",
    "pbc.listOnlyHint": "ဤစာရင်းတွင်သာ ရှိသည်။ Matching သို့ မတင်ပါ။",
    "pbc.kicker": "Client PBC Portal",
    "pbc.title": "ကလိုင်းယင့် PBC Portal နှင့် တောင်းဆိုချက်များ",
    "pbc.subtitle":
      "စာရင်းစစ် စမ်းသပ်ရန် client ပြင်ဆင်သော (PBC) စာရွက်စာတမ်း တောင်းဆိုချက်များကို ခြေရာခံပြီး စစ်ပါ။",
    "pbc.statPending": "ဆိုင်းငံ့ PBC",
    "pbc.statUploaded": "တင်ပြီး / မစစ်ရသေး",
    "pbc.statApproved": "အတည်ပြုပြီး စာရင်းစစ်ရန် အသင့်",
    "pbc.checklist": "လက်ရှိ PBC စစ်ဆေးစာရင်း (တောင်းဆို {count} ခု)",
    "pbc.idLabel": "ID:",
    "pbc.deadlineLabel": "နောက်ဆုံးရက်:",
    "pbc.uploadedFile": "တင်ထားသော ဖိုင်",
    "pbc.approve": "အတည်ပြုမည်",
    "pbc.reject": "ငြင်းပယ်မည်",
    "pbc.removeFile": "ဖိုင် ဖယ်ထုတ်မည်",
    "pbc.statusPending": "ဆိုင်းငံ့",
    "pbc.statusUploaded": "တင်ပြီး",
    "pbc.statusApproved": "အတည်ပြုပြီး",
    "pbc.statusRejected": "ငြင်းပယ်ပြီး",
    "pbc.catAccountsPayable": "Accounts Payable",
    "pbc.catCashBank": "Cash & Bank",
    "pbc.catExpenses": "Expenses",
    "pbc.catFixedAssets": "Fixed Assets",
    "pbc.catGovernance": "Governance",
    "pbc.whatTitle": "PBC List ဆိုသည်မှာ?",
    "pbc.whatBody":
      "PBC stands for Prepared by Client. စာရင်းစစ်အဖွဲ့က client ထံ တောင်းသော စာရွက်စာတမ်း စာရင်းဖြစ်သည်။ ToD invoice နှင့် bank PDF၊ ပုံ၊ သို့မဟုတ် JSON ကို Matching Import သို့ ပို့နိုင်သည်။ Ledger၊ confirmation၊ minutes၊ trial balance နှင့် spreadsheet များ ဤစာရင်းတွင်သာ ရှိသည်။",
    "tb.importTb": "Trial Balance တင်မည်",
    "tb.importListing": "Listing တင်မည်",
    "tb.sendToMatching": "Matching သို့ ပို့မည်",
    "tb.pickLead": "Lead ရွေးပါ",
    "tb.tieOutOk": "Listing နှင့် TB lead ကိုက်သည်။",
    "tb.tieOutWarn":
      "Listing နှင့် TB lead မကိုက်သေးပါ။ Sample ကို ဆက်ပို့နိုင်သည်။",
    "tb.parseFailed":
      "Spreadsheet ကို ဖတ်မရပါ။ လိုအပ်သော header ရှိမရှိ စစ်ပါ။",
    "tb.sendHint":
      "Lead ရွေးပြီး listing လိုင်းကို tick ကာ Matching Step 1 သို့ ပို့ပါ။ Debit နှင့် credit ညီရုံဖြင့် မပိတ်ပါ။",
    "tb.selectAll": "ပြထားသည်များ အားလုံးရွေး",
    "tb.listingEmpty": "ဤ lead အတွက် listing လိုင်း မရှိသေးပါ။",
    "tb.kicker": "Trial Balance",
    "tb.title": "Trial Balance စစ်ဆေးခြင်း",
    "tb.subtitle":
      "စာရင်းစစ် trial balance တင်ပြီး ledger အကောင့်များကို ချိတ်ကာ ဂဏန်းညီညွတ်မှုကို စစ်ပါ။",
    "tb.balanceOk": "လက်ကျန်အခြေအနေ: Ledger ညီသည်",
    "tb.balanceWarn": "လက်ကျန်အခြေအနေ: Ledger မညီသေးပါ",
    "tb.balanceHint":
      "စုစုပေါင်း Debit နှင့် Credit ကို ပြသည်။ မညီလည်း sample ပို့ခြင်းကို မပိတ်ပါ။",
    "tb.debits": "စုစုပေါင်း Debit:",
    "tb.credits": "စုစုပေါင်း Credit:",
    "tb.mappings": "Ledger အကောင့် ချိတ်ဆက်မှုများ",
    "tb.searchPlaceholder": "ကုဒ် သို့မဟုတ် အမည် ရှာပါ...",
    "tb.colCode": "ကုဒ်",
    "tb.colDescription": "အကောင့်အကြောင်းအရာ",
    "tb.colDebit": "Debit",
    "tb.colCredit": "Credit",
    "tb.colMapping": "F/S အုပ်စု Mapping",
    "tb.colInvoice": "Invoice",
    "tb.colDate": "ရက်စွဲ",
    "tb.colAmount": "ပမာဏ",
    "tb.guidelinesTitle": "Listing sample ကို Matching သို့ ပို့ပါ",
    "results.sendToWorkpapers": "Workpapers သို့ ပို့မည်",
    "wp.signFile": "Workpaper လက်မှတ်ထိုးမည်",
    "wp.fileHint":
      "Matching Review မှ ToD ရလဒ်ကို ပို့ပြီး exception / partial ကို လက်မှတ်ထိုးမှ file ကို ထိုးပါ။ Follow-up ရှိရင် မြင်ရသော်လည်း မပိတ်ပါ။",
    "wp.unsignedHint":
      "Exception သို့မဟုတ် partial လိုင်းကို Matching Review တွင် အရင် လက်မှတ်ထိုးပါ။",
    "wp.followUpWarn":
      "Follow-up မှတ်ထားသော လိုင်းရှိသည်။ File ကို ဆက်ထိုးနိုင်သည်။",
    "wp.snipCount": "Snip များ",
    "wp.noSnips": "ဤ pack တွင် snip မရှိသေးပါ။",
    "wp.minutesTitle": "PBC အစည်းအဝေးမှတ်တမ်း",
    "wp.minutesEmpty": "ဤဖိုင်တွင် minutes မရှိသေးပါ။",
    "wp.kicker": "စာရင်းစစ်မှတ်တမ်း",
    "wp.title": "စာရင်းစစ်မှတ်တမ်း စစ်ဆေးစာရင်း",
    "wp.subtitle":
      "Workpaper လက်မှတ်၊ ပြင်ဆင်သူ တာဝန်ပေးမှုနှင့် အကောင်အထည်ဖော်မှု တိုးတက်မှုကို စီမံပါ။",
    "wp.feedbackKicker": "စာရင်းစစ် တုံ့ပြန်ချက်",
    "wp.feedbackTitle": "ကျန်ရှိသော Review Notes",
    "wp.feedbackSubtitle":
      "စာရွက်စာတမ်း လက်မှတ်ထိုးပြီးစီးရန် မန်နေဂျာနှင့် ပါတနာ မှတ်ချက်များကို ရှင်းပါ။",
    "wp.notesCount": "မှတ်ချက် {count} ခု",
    "wp.assigned": "တာဝန်: {preparer} (ပြင်ဆင်) | {reviewer} (စစ်ဆေး)",
    "wp.workpaperLabel": "Workpaper:",
    "wp.reviewerLabel": "စစ်ဆေးသူ:",
    "wp.responseLabel": "တုံ့ပြန်ချက်:",
    "wp.respond": "တုံ့ပြန်မည်",
    "wp.clearClose": "ရှင်းပြီး ပိတ်မည်",
    "wp.cancel": "ပယ်ဖျက်မည်",
    "wp.submit": "တင်မည်",
    "wp.responsePlaceholder": "စာရင်းစစ် တုံ့ပြန်ချက် ရေးပါ...",
    "wp.statusNotStarted": "မစသေးပါ",
    "wp.statusInProgress": "လုပ်ဆောင်နေသည်",
    "wp.statusReadyForReview": "စစ်ဆေးရန် အသင့်",
    "wp.statusApproved": "အတည်ပြုပြီး",
    "wp.noteOpen": "ဖွင့်ထားသည်",
    "wp.noteResponded": "တုံ့ပြန်ပြီး",
    "wp.noteClosed": "ပိတ်ပြီး",
    "app.browserWarning":
      "စမ်းသပ်ပြသမှုစနစ် (Browser preview mode) ဖြစ်နေပါသည်။ စာရင်းဇယားရွေးချယ်ခြင်း၊ ရလဒ်များကို Excel ထဲသို့ ပြန်လည်ရေးသားခြင်းနှင့် Hidden audit log များ သိမ်းဆည်းရန်အတွက် Excel အတွင်း DocTrace ကို ဖွင့်လှစ်အသုံးပြုပေးပါ။",
    "project.kicker": "DOCTRACE အကြောင်း",
    "project.title":
      "အလိုအလျောက် သက်သေခံစာရွက်စာတမ်း တိုက်ဆိုင်စစ်ဆေးရေးအင်ဂျင်",
    "project.description":
      "စာရင်းဇယားပါ အချက်အလက်များကို Invoice နှင့် Bank Statement သက်သေခံစာရွက်စာတမ်းများနှင့် တိကျသေချာစွာ တိုက်ဆိုင်စစ်ဆေးပေးသည်။",
    "project.invoiceTitle": "Invoice-side evidence",
    "project.invoiceBody":
      "Digital PDF များမှ စာသားကို တိုက်ရိုက်ဖတ်ခြင်း၊ Scanned image (ပုံရိပ်ဖတ်စနစ်) များကို OCR ဖြင့် ဖတ်ခြင်းနှင့် စနစ်တကျ ပြင်ဆင်ထားသော JSON ဖိုင်များမှ ပြေစာနံပါတ်၊ ရက်စွဲ၊ ပမာဏနှင့် သက်သေခံချက်များကို အလိုအလျောက် ထုတ်ယူနိုင်ပါသည်။",
    "project.statementTitle": "Statement-side traceability",
    "project.statementBody":
      "ဘဏ်ရှင်းတမ်းလိုင်းများ (Bank statement lines) ကို ရက်စွဲ၊ ပမာဏနှင့် ကိုးကားချက် ဆန်ခါတင်များအဖြစ် ခွဲခြမ်းဆန်းစစ်ပြီး (parse) ချိတ်ဆက်ထားသော worksheet ကော်လံများနှင့် workbook ၏ စာရင်းစစ်မှတ်တမ်း (workbook audit log) ထဲသို့ ရေးသားပေးပါသည်။",
    "results.kicker": "Step 4",
    "results.title": "တိုက်ဆိုင်စစ်ဆေးပြီး ရလဒ်များအား စစ်ဆေးပါ",
    "results.description":
      "ကွာဟချက်များကို ဆန်းစစ်ပြီး သက်သေခံအချက်အလက်များနှင့် စာရင်းစစ်ဆေးမှုမှတ်တမ်း (Audit Trail) ကို တင်ပို့နိုင်ပါသည်။",
    "results.exportCsv": "CSV Export",
    "results.rows": "Rows",
    "results.showingRows": "ပြသထားသည်",
    "results.loadMore": "နောက်ထပ် Rows များ ဖော်ပြပါ",
    "results.matched": "တိုက်ဆိုင်မှုရှိသည် (Matched)",
    "results.partial": "တစ်စိတ်တစ်ပိုင်း ကိုက်ညီသည် (Partial)",
    "results.exception": "လွဲမှားမှုရှိသည် (Exception)",
    "results.confidence": "ယုံကြည်စိတ်ချရမှုနှုန်း (Confidence)",
    "results.discrepancy": "ကွာဟချက်များ ဆန်းစစ်ချက်",
    "results.row": "Row",
    "results.score": "ရမှတ် (Score)",
    "results.invoiceEvidence": "Invoice သက်သေခံချက်",
    "results.bankEvidence": "ဘဏ်သက်သေခံချက်",
    "results.noLinkedSource": "ချိတ်ဆက်ထားသည့် သက်သေခံစာရွက်စာတမ်း မရှိပါ",
    "results.inspectTrace": "Inspection pane တွင် စစ်ရန်",
    "results.noResults": "ရလဒ် မရှိသေးပါ",
    "results.noResultsDescription":
      "စာရင်းဇယား တိုက်ဆိုင်စစ်ဆေးမှုကို Step 3 တွင် လုပ်ဆောင်ပြီး စာရင်းစစ်ဆေးမှုမှတ်တမ်းများ ထုတ်ယူပါ။",
    "results.busySkeletonAria": "တိုက်ဆိုင်စစ်ဆေးနေသည်",
    "results.clearlyTrivial": "ဂရုမပြုလောက်သော လွဲမှားမှု (Clearly Trivial)",
    "results.belowPerformance":
      "လုပ်ငန်းဆောင်ရွက်မှု အရေးကြီးမှုအဆင့်အောက် လွဲမှားမှု (Below Performance)",
    "results.materialException": "အရေးကြီးသော လွဲမှားမှု (Material Exception)",
    "results.aboveOverall":
      "အလုံးစုံ အရေးကြီးမှုအဆင့်အထက် လွဲမှားမှု (Above Overall)",
    "results.unassessed": "အရေးကြီးမှု မသတ်မှတ်ရသေးပါ (Unassessed)",
    "results.discrepancyAmount": "ကွာဟချက်ပမာဏ",
    "results.materialityAssessment": "အရေးကြီးမှု ဆန်းစစ်ချက်",
    "status.matched": "တိုက်ဆိုင်မှုရှိသည်",
    "status.partial": "တစ်စိတ်တစ်ပိုင်းကိုက်ညီ",
    "status.exception": "လွဲမှားမှုရှိသည်",
    "nav.matching": "🛠️ Matching",
    "nav.engagements": "📊 Engagements",
    "nav.trialBalance": "⚖️ Trial Balance",
    "nav.workpapers": "📁 Workpapers",
    "nav.clientPortal": "🌐 Client Portal",
    "eng.title": "စာရင်းစစ်လုပ်ငန်းများနှင့် Dashboard",
    "eng.kicker": "DocTrace မော်ဂျူးများ",
    "eng.new": "စာရင်းစစ်လုပ်ငန်း အသစ်ဖန်တီးရန်",
    "eng.clientName": "ကလိုင်းယင့်အမည်",
    "eng.financialYear": "ဘဏ္ဍာရေးနှစ် (FY)",
    "eng.framework": "စာရင်းစစ် စံနှုန်းသတ်မှတ်ချက် (Framework)",
    "eng.status": "အခြေအနေ",
    "eng.create": "ဖန်တီးမည်",
    "eng.cancel": "ပယ်ဖျက်မည်",
    "eng.team": "Audit စစ်ဆေးရေးအဖွဲ့ ဖွဲ့စည်းပုံ",
    "eng.partner": "Engagement Partner (စာရင်းစစ်ပါတနာ)",
    "eng.manager": "Audit Manager (မန်နေဂျာ)",
    "eng.senior": "Senior Auditor (အကြီးတန်းစာရင်းစစ်)",
    "eng.associate": "Associate (အငယ်တန်းစာရင်းစစ်)",
    "eng.progress": "စာရင်းစစ်ဆေးမှု တိုးတက်မှုအခြေအနေ",
    "eng.workpapers": "ပြီးစီးခဲ့သော စာရင်းစစ်မှတ်တမ်းတွဲများ (Workpapers)",
    "eng.reviewNotes": "ကျန်ရှိနေသေးသော စစ်ဆေးချက်မှတ်စုများ (Review Notes)",
    "eng.pbcRequests": "PBC စာရွက်စာတမ်း တောင်းဆိုမှုများ",
    "eng.delete": "ဖျက်သိမ်းမည်",
    "eng.eqReviewer": "EQ Reviewer (အရည်အသွေး ဆန်းစစ်သူ)",
    "eng.overallMateriality": "Overall Materiality (အလုံးစုံ အရေးကြီးမှုအဆင့်)",
    "eng.performanceMateriality":
      "Performance Materiality (လုပ်ငန်းဆောင်ရွက်မှု အရေးကြီးမှုအဆင့်)",
    "eng.trivialThreshold": "Trivial Threshold (ဂရုမပြုလောက်သည့် အဆင့်)",
    "eng.lock": "စာရင်းစစ်ဆေးမှု လော့ခ်ချရန် (Lock)",
    "eng.unlock": "စာရင်းစစ်ဆေးမှု လော့ခ်ပြန်ဖွင့်ရန် (Unlock)",
    "eng.locked": "လော့ခ်ချပြီး",
    "eng.unlocked": "လော့ခ်မချရသေး",
    "eng.wizard.title": "စာရင်းစစ်လုပ်ငန်း စတင်သတ်မှတ်ရန်",
    "eng.wizard.step1": "လုပ်ငန်းအခြေခံအချက်အလက်များ",
    "eng.wizard.step2": "အရေးကြီးမှုအဆင့်သတ်မှတ်ချက် (Materiality)",
    "eng.wizard.step3": "စာရင်းစစ်အဖွဲ့ဝင်များသတ်မှတ်ခြင်း",
    "eng.wizard.step4": "အကျဉ်းချုပ်နှင့် အတည်ပြုခြင်း",
    "eng.wizard.next": "ရှေ့သို့",
    "eng.wizard.back": "နောက်သို့",
    "eng.wizard.finish": "စတင်မည်",
    "eng.wizard.progress": "အဆင့် {current} / {total}",
    "eng.placeholder.clientExample": "ဥပမာ - TZ Assurance Client A",
    "eng.placeholder.epName": "EP အမည်",
    "eng.placeholder.emName": "EM အမည်",
    "eng.placeholder.seniorInCharge": "Senior In-Charge အမည်",
    "eng.placeholder.associate": "Associate အမည်",
    "eng.placeholder.eqReviewer": "EQ Reviewer အမည်",
    "eng.placeholder.iso": "ISO",
    "eng.placeholder.partner": "ပါတနာ အမည်",
    "eng.placeholder.manager": "မန်နေဂျာ အမည်",
    "eng.placeholder.senior": "Senior အမည်",
    "workflow.kicker": "လုပ်ငန်းစဉ်",
    "workflow.title": "စာရွက်စာတမ်း တိုက်ဆိုင်စစ်ဆေးမှု အဆင့်ဆင့်",
    "workflow.desc":
      "လုပ်ငန်းစဉ် ခြုံငုံသုံးသပ်ချက်သာ ဖြစ်သည်။ တစ်ဆင့်ချင်းစီ လုပ်ဆောင်ရန် အထက်ပါ အပြန်အလှန်အကျိုးပြုစနစ်များကို အသုံးပြုပါ။",
    "workflow.step1Title": "နမူနာစာရင်း ရွေးချယ်ဖမ်းယူခြင်း",
    "workflow.step1Desc": "Excel မှ နမူနာစာရင်းလိုင်းများကို ရွေးချယ်ပါ",
    "workflow.step2Title": "သက်သေခံစာရွက်စာတမ်း တင်သွင်းခြင်း",
    "workflow.step2Desc": "ရောင်းပြေစာများနှင့် ဘဏ်ရှင်းတမ်းများကို တင်ပါ",
    "workflow.step3Title": "ကိုက်ညီမှုစံနှုန်း သတ်မှတ်ခြင်း",
    "workflow.step3Desc": "ကော်လံများ ချိတ်ဆက်ခြင်းနှင့် ကွာဟချက်သတ်မှတ်ခြင်း",
    "workflow.step4Title": "ရလဒ်များကို စစ်ဆေးခြင်း",
    "workflow.step4Desc":
      "ရလဒ်များကို စစ်ဆေးပါ။ Inspect နှိပ်ပါက inspection pane တွင် အဲဒီလိုင်း၏ သက်သေခံချက် ပွင့်ပါမည်။",
    "workflow.step1Short": "ရွေး",
    "workflow.step2Short": "တင်",
    "workflow.step3Short": "တွဲ",
    "workflow.step4Short": "စစ်",
    "firstrun.body": "နမူနာရွေး၊ သက်သေတင်၊ တွဲပြီး ရလဒ်စစ်ပါ။",
    "firstrun.gotIt": "ရပါပြီ",
    "firstrun.skip": "ကျော်မည်",
    "app.working": "ဆောင်ရွက်နေသည်...",
    "app.enabled": "ဖွင့်ထားသည်",
    "app.disabled": "ပိတ်ထားသည်",
    "app.preview": "စမ်းသပ်ကြည့်ရှုမည်",
    "app.remove": "ဖယ်ထုတ်မည်",
    "app.yes": "ဟုတ်ကဲ့",
    "app.no": "မရှိပါ/မဟုတ်ပါ",
    "app.notice": "အသိပေးချက်",
    "app.success": "အောင်မြင်သည်",
    "app.error": "မှားယွင်းမှု",
    "selection.step": "အဆင့် ၁",
    "selection.title": "နမူနာစာရင်း ရွေးချယ်ဖမ်းယူခြင်း",
    "selection.headersTitle": "ပထမဆုံးလိုင်းသည် ကော်လံခေါင်းစဉ်များ ဖြစ်သည်",
    "selection.headersDesc":
      "တိကျသေချာသော ကော်လံချိတ်ဆက်မှုအတွက် ဖွင့်ထားရန် အကြံပြုအပ်ပါသည်။",
    "selection.address": "လိပ်စာ (Address)",
    "selection.sheet": "စာမျက်နှာ (Sheet)",
    "selection.rowsCount": "လိုင်းအရေအတွက်",
    "selection.columnsCount": "ကော်လံအရေအတွက်",
    "selection.col": "ကော်လံ",
    "selection.showingSubset":
      "စုစုပေါင်း လိုင်းပေါင်း {rowCount} အနက် ပထမဆုံး ၅ လိုင်းကို ပြသထားသည်",
    "selection.emptyState":
      "နမူနာစာရင်း တိုက်ဆိုင်စစ်ဆေးမှုကို စတင်ရန် Excel တွင် sample range ကို ရွေးချယ်ပြီး ဖမ်းယူပေးပါ။",
    "selection.captureBtn": "Selection ဖမ်းယူမည်",
    "import.step": "အဆင့် ၂",
    "import.title": "သက်သေခံစာရွက်စာတမ်း တင်သွင်းခြင်း",
    "import.desc":
      "PDF၊ ပုံနှင့် JSON များကို ဤစာကြည့်တိုက်တွင် စုပါ။ Preview နှိပ်ပါက inspection pane တွင် စာမျက်နှာ ပွင့်ပါမည်။",
    "import.invoiceEvidence": "ပြေစာ (Invoice) သက်သေခံချက်များ",
    "import.invoiceDesc": "PDF၊ Scan ပုံများ သို့မဟုတ် JSON ဖိုင်တွဲများ",
    "import.browseInvoices": "Invoices ရှာဖွေတင်သွင်းမည်",
    "import.bankStatements": "ဘဏ်ရှင်းတမ်းများ (Bank Statements)",
    "import.bankDesc":
      "ငွေစာရင်းလွှဲပြောင်းမှုမှတ်တမ်း သို့မဟုတ် စာရင်းတိုက်ဆိုင်မှုဖိုင်များ",
    "import.browseBank": "ဘဏ်ဖိုင်များ ရှာဖွေတင်သွင်းမည်",
    "import.jsonSupportTitle": "JSON သက်သေခံချက် ပံ့ပိုးမှုစနစ်",
    "import.jsonSupportDesc":
      "DocTrace သည် သက်သေခံစာရွက်စာတမ်းမျိုးစုံ ပါဝင်သော JSON ဖိုင်များကို အလိုအလျောက် တင်သွင်းပေးနိုင်သည်။ စတင်ရန် Browse မှတဆင့် ရွေးချယ်ပါ။",
    "import.busySkeletonAria": "စာရွက်စာတမ်းများ တင်သွင်းနေသည်",
    "import.invoiceLibrary": "ပြေစာ (Invoice) စာကြည့်တိုက်",
    "import.bankLibrary": "ဘဏ်ရှင်းတမ်း (Bank Statement) စာကြည့်တိုက်",
    "import.pageImported": "စာမျက်နှာ - တင်သွင်းပြီး",
    "import.docCount": "သက်သေခံစာရွက်စာတမ်း {count} ခု",
    "import.fileCount": "ဖိုင် {count} ခု",
    "import.id": "ID (နံပါတ်)",
    "import.amount": "ပမာဏ",
    "import.date": "ရက်စွဲ",
    "import.jsonSource": "JSON သက်သေခံချက်",
    "import.emptyState":
      "ဤဖိုဒါအတွင်း ဖိုင်မရှိသေးပါ။ စတင်ရန် သက်သေခံစာရွက်စာတမ်းအချို့ တင်သွင်းပေးပါ။",
    "import.rename": "အမည်ပြောင်းမည်",
    "import.download": "ဒေါင်းလုဒ်",
    "import.downloadStoredHint":
      "သိမ်းထားသော မိတ္တူဖြစ်သည်။ မူရင်းဖိုင်ထက် သေးနိုင်သည်။",
    "import.downloadFailed": "ဖိုင်ကို သိမ်း၍မရပါ",
    "import.downloadHostUnconfirmed":
      "ဤ Excel host သည် ဖိုင်သိမ်းမှုကို ပိတ်ထားနိုင်သည်။ Preview သည် ဆက်လက် အလုပ်လုပ်ပါသည်။",
    "import.renameInvalid": "ဖိုင်အမည် မမှန်ကန်ပါ",
    "import.renameSessionOnly":
      "အမည်ကို ဤ session တွင် ပြောင်းပြီးပါပြီ။ Workbook index ကို မွမ်းမံ၍မရပါ။",
    "import.busyInvoice": "ပြေစာ စာရွက်စာတမ်း {count} ခု ဖတ်ယူနေသည်",
    "import.busyBank": "ဘဏ်ရှင်းတမ်း စာရွက်စာတမ်း {count} ခု ဖတ်ယူနေသည်",
    "import.activityInvoice": "ပြေစာ သက်သေခံချက် တင်သွင်းနေသည်",
    "import.activityBank": "ဘဏ်ရှင်းတမ်း သက်သေခံချက် တင်သွင်းနေသည်",
    "import.activitySelected": "ဖိုင် {count} ခု ရွေးထားသည်။",
    "import.activityImported": "သက်သေခံချက် တင်သွင်းပြီးပါပြီ",
    "import.activityNone": "သက်သေခံချက် ထုတ်ယူ၍မရပါ",
    "import.activityImportedDesc":
      "ဖတ်ယူပြီး စာရွက်စာတမ်း {count} ခု ဘေးဘားတွင် အသင့်ရှိပါသည်။",
    "import.activityNoneDesc":
      "ရွေးထားသော ဖိုင်များကို ဖတ်ပြီးသော်လည်း သက်သေခံမှတ်တမ်း မထွက်ပါ။",
    "import.summarySuccessTitle": "စာရွက်စာတမ်းများ တင်သွင်းပြီးပါပြီ",
    "import.summarySuccessDesc":
      "ဖတ်ယူပြီး စာရွက်စာတမ်း {count} ခု ပြန်လည်သုံးသပ်ရန်နှင့် ကိုက်ညီစစ်ဆေးရန် အသင့်ရှိပါသည်။",
    "import.summaryNoneTitle": "သက်သေခံချက် မတင်သွင်းနိုင်ပါ",
    "import.summaryNoneDesc":
      "ရွေးထားသော ဖိုင်များကို ဖတ်ပြီးသော်လည်း သက်သေခံမှတ်တမ်း မထွက်ပါ။",
    "import.summaryMixedTitle": "တင်သွင်းမှု အမှားများ ပါရှိသည်",
    "import.summaryMixedDesc":
      "{count} ခု တင်သွင်းပြီး၊ {failed} ခု မအောင်မြင်ပါ။",
    "import.parseFailedTitle": "{name} ကို ဖတ်ယူ၍မရပါ",
    "import.parseFailedDesc": "ထုတ်ယူရန် ဒေတာ မထွက်ပါ။",
    "import.unsupportedType":
      "ဤဖိုင်အမျိုးအစားကို လက်မခံပါ။ PDF၊ JSON၊ PNG၊ JPG၊ JPEG၊ BMP၊ GIF သို့မဟုတ် TIFF ကို သုံးပါ။",
    "import.failedTitle": "တင်သွင်းမှု မအောင်မြင်ပါ",
    "import.failedDesc": "ရွေးထားသော ဖိုင်များကို တင်သွင်း၍မရပါ။",
    "import.statusParsed": "ဖတ်ယူပြီး",
    "import.statusError": "အမှား",
    "import.statusParsing": "ဖတ်ယူနေသည်",
    "import.statusIdle": "အသင့်",
    "config.step": "အဆင့် ၃",
    "config.title": "ကိုက်ညီမှုစံနှုန်း သတ်မှတ်ခြင်း",
    "config.desc":
      "DocTrace ၏ စာရင်းတိုက်ဆိုင်စစ်ဆေးမှုပုံစံနှင့် Excel workbook သို့ ပြန်လည်ရေးသားမည့် နည်းလမ်းကို သတ်မှတ်ပါ။",
    "config.suggested": "အကြံပြုထားသည့် ချိတ်ဆက်မှုစနစ်",
    "config.sourceColumns": "မူရင်း စာရင်းဇယား ကော်လံများ",
    "config.amountCol": "ပမာဏကော်လံ (Amount column)",
    "config.dateCol": "ရက်စွဲကော်လံ (Date column)",
    "config.refCol": "ပြေစာ/ကိုးကားချက်ကော်လံ (Invoice/reference column)",
    "config.selectCol": "ကော်လံတစ်ခု ရွေးချယ်ပါ",
    "config.matchingLogic": "Matching Logic",
    "config.amountTol": "ခွင့်ပြုနိုင်သော ကွာဟချက်ပမာဏ (Amount tolerance)",
    "config.amountTolPercent":
      "ခွင့်ပြုနိုင်သော ကွာဟချက် ရာခိုင်နှုန်း (Amount tolerance %)",
    "config.dateTol": "ခွင့်ပြုနိုင်သော ရက်စွဲကွာဟချက် (ရက်စွဲ ဝင်းဒိုး)",
    "config.scoreWeights": "ယုံကြည်မှု အလေးချိန် (Confidence weights)",
    "config.scoreWeightsHint":
      "ဆက်စပ် အလေးချိန်များ ဖြစ်သည်။ ပေါင်းလဒ် ၁၀၀ ဖြစ်ရန် မလိုအပ်ပါ။",
    "config.weightInvoice": "ပြေစာနံပါတ်",
    "config.weightAmount": "ပမာဏ",
    "config.weightDate": "ရက်စွဲ",
    "config.requireInvoice": "ပြေစာနံပါတ် တိကျစွာ ကိုက်ညီရန် လိုအပ်သည်",
    "config.allowFuzzy": "စာသား အနီးစပ်ဆုံး တိုက်ဆိုင်စစ်ဆေးမှုကို ခွင့်ပြုသည်",
    "config.outputFields": "ရလဒ်အဖြစ် ရေးသားမည့် ကော်လံများ (Output Fields)",
    "config.enabledCount": "ခု ဖွင့်ထားသည်",
    "config.excelMapping":
      "Excel ရလဒ် ကော်လံများ ချိတ်ဆက်ခြင်း (Excel Output Mapping)",
    "config.targets": "ခု ချိတ်ဆက်ထားသည်",
    "config.writesInto": "ဤကော်လံသို့ ရေးသားမည် -",
    "config.selectTarget": "ရလဒ်ရေးသားမည့် ကော်လံကို ရွေးချယ်ပါ",
    "config.emptyState":
      "Excel output mapping စံနှုန်းများကို သတ်မှတ်ရန် Excel နမူနာဇယားကို အရင်ဆုံး ဖမ်းယူပေးပါ။",
    "config.readyMatch": "တိုက်ဆိုင်စစ်ဆေးရန် အသင့်ဖြစ်ပါပြီ",
    "config.loadedSummary":
      "ပြေစာ {invoiceCount} စောင်နှင့် ဘဏ်ရှင်းတမ်း {bankCount} ခု တင်သွင်းပြီးပါပြီ။",
    "config.matchActive": "ရွေးထားသောလိုင်းကိုသာ တိုက်စစ်မည်",
    "config.matchAll": "လိုင်းအားလုံးကို တိုက်ဆိုင်စစ်ဆေးမည်",
    "config.identityTitle": "ပြင်ဆင်သူ / စစ်ဆေးသူ အတိုကောက်",
    "config.preparer": "ပြင်ဆင်သူ (Preparer)",
    "config.reviewer": "စစ်ဆေးသူ (Reviewer)",
    "config.preparerPlaceholder": "ဥပမာ KZ",
    "config.reviewerPlaceholder": "ဥပမာ AY",
    "config.out.invoiceDocument": "ပြေစာဖိုင်အမည် (Invoice document)",
    "config.out.invoiceAmount": "ပြေစာပါ ပမာဏ (Invoice amount)",
    "config.out.invoiceDate": "ပြေစာပါ ရက်စွဲ (Invoice date)",
    "config.out.invoiceNumber": "ပြေစာနံပါတ် (Invoice number)",
    "config.out.bankDocument": "ဘဏ်ရှင်းတမ်းဖိုင်အမည် (Bank document)",
    "config.out.bankAmount": "ဘဏ်ရှင်းတမ်းပါ ပမာဏ (Bank amount)",
    "config.out.bankDate": "ဘဏ်ရှင်းတမ်းပါ ရက်စွဲ (Bank date)",
    "config.out.bankReference": "ဘဏ်ရှင်းတမ်းပါ ကိုးကားချက် (Bank reference)",
    "config.out.status": "တိုက်ဆိုင်စစ်ဆေးမှု အခြေအနေ (Status)",
    "config.out.confidence": "ယုံကြည်စိတ်ချရမှုနှုန်း (Confidence)",
    "results.clear": "တိုက်ဆိုင်မှု ဖျက်သိမ်းမည်",
    "results.rematch": "ထပ်မံ တိုက်ဆိုင်စစ်ဆေးမည်",
    "results.signOff": "Exception လက်မှတ်ထိုးရန်",
    "results.signOffComment": "မှတ်ချက်",
    "results.signOffCommentPlaceholder":
      "ဘာကြောင့် conclude / waive / follow-up လုပ်သည်ကို ရေးပါ",
    "results.conclude": "Conclude",
    "results.waive": "Waive",
    "results.followUp": "Follow-up",
    "results.signedOff": "လက်မှတ်ထိုးပြီး",
    "results.rowLocked": "ဤလိုင်းကို ပြန်မတိုက်စစ်နိုင်ပါ",
    "identity.requiredTitle": "ပြင်ဆင်သူနှင့် စစ်ဆေးသူ လိုအပ်သည်",
    "identity.requiredDescription":
      "Match မစခင် ပြင်ဆင်သူနှင့် စစ်ဆေးသူ အတိုကောက် နှစ်ခုလုံး ရိုက်ထည့်ပါ။",
    "identity.sameNameTitle": "ပြင်ဆင်သူနှင့် စစ်ဆေးသူ တူနေသည်",
    "identity.sameNameDescription":
      "ဤထုတ်ဝေမှုတွင် ဆက်လုပ်နိုင်သည်။ သီးခြား reviewer ကို နောက်မှ ပြင်နိုင်သည်။",
    "identity.saveFailed": "Identity ကို workbook ထဲသို့ မသိမ်းနိုင်ပါ။",
    "results.signOffSuccessTitle": "Exception လက်မှတ်ထိုးပြီး",
    "results.signOffSuccessDescription":
      "ဤလိုင်းကို ပြန်မတိုက်စစ်နိုင်အောင် လော့ခ်ချထားသည်။",
    "results.lockedRematchTitle": "လိုင်း လော့ခ်ချထားသည်",
    "results.lockedRematchDescription":
      "Sign-off လုပ်ပြီးသော လိုင်းကို ပြန်မတိုက်စစ်နိုင်ပါ။",
    "results.averageConfidence": "ပျမ်းမျှ ယုံကြည်စိတ်ချရမှုနှုန်း",
    "results.discrepancyCount": "ကွာဟချက် စုစုပေါင်း",
    "activity.kicker": "တိုက်ရိုက်လှုပ်ရှားမှုမှတ်တမ်း",
    "activity.title": "DocTrace ၏ လက်ရှိလုပ်ဆောင်ချက်များ",
    "activity.desc":
      "ကလစ်နှိပ်မှုတိုင်းကို ဤနေရာတွင် ဖော်ပြပေးမည်ဖြစ်ရာ Excel ဘက်မှ အမှားအယွင်းများကို DevTools ဖွင့်စရာမလိုဘဲ တွေ့မြင်နိုင်ပါသည်။",
    "activity.events": "ခု တွေ့ရှိရသည်",
    "activity.emptyState":
      "လုပ်ငန်းစဉ်တစ်ခုကို ကလစ်နှိပ်ပါက ရလဒ်များ ဤနေရာတွင် ပေါ်လာပါမည်။",
    "activity.justNow": "ခုလေးတင်",
    "viewer.kicker": "Inspection pane",
    "viewer.title": "သက်သေခံချက် စစ်ဆေးခြင်း",
    "viewer.desc":
      "စာမျက်နှာကို ကြည့်၊ ချဲ့၊ မှတ်ပြီး Excel cell သို့ ချိတ်ပါ။ ဤ pane သည် workflow အဆင့် မဟုတ်ပါ။",
    "viewer.noPreview": "ကြည့်ရှုရန် မရှိသေးပါ",
    "viewer.expand": "ဖွင့်",
    "viewer.collapse": "ပိတ်",
    "viewer.backToWorkflow": "လုပ်ငန်းစဉ်သို့ ပြန်ရန်",
    "viewer.zoomFit": "Fit",
    "viewer.zoomOut": "ချုံ့",
    "viewer.zoomIn": "ချဲ့",
    "viewer.zoomLabel": "Zoom",
    "viewer.snipModeOn": "Snip mode ဖွင့်",
    "viewer.snipModeOff": "Snip စတင်ရန်",
    "viewer.snipModeOnTitle": "Snip mode ပိတ်ရန်",
    "viewer.snipModeOffTitle":
      "PDF စာသား၊ ပုံအပိုင်း သို့မဟုတ် snippet မှတ်ရန် Snip mode ဖွင့်ပါ",
    "viewer.onPage": "ဤစာမျက်နှာ",
    "viewer.snipHint":
      "စာလုံး = တစ်ချက်။ စာကြောင်း = နှစ်ချက်။ ဇယား = ဆွဲ။ မှတ်ပြီးသားများသည် အောက်စာရင်းတွင် ရှိသည်။",
    "viewer.activeSnip": "လက်ရှိ snip",
    "viewer.linkToCell": "Cell သို့ ချိတ်",
    "viewer.linkToCellTitle": "ရွေးထားသော Excel cell သို့ ဤစာသား ရေးရန်",
    "viewer.removeSnip": "ဖယ်ရှား",
    "viewer.emptyState":
      "စာကြည့်တိုက်မှ Preview နှိပ်ပါ သို့မဟုတ် ရလဒ်တွင် Inspect နှိပ်ပါ။",
    "viewer.pdfFailed": "PDF စမ်းသပ်ကြည့်ရှုမှု မအောင်မြင်ပါ။",
    "viewer.fileNotFound":
      "ဒေသတွင်းသိုလှောင်မှုတွင် ဖိုင်ကို ရှာမတွေ့ပါ။ ကျေးဇူးပြု၍ ဖိုင်ကို ပြန်လည်တင်ပေးပါ။",
    "viewer.extractedSnippet": "ထုတ်ယူထားသော အကျဉ်းချုပ်",
    "viewer.manualSnip": "ကိုယ်တိုင် ဖြတ်ညှပ်ချက်",
    "viewer.imageRegion": "ပုံရိပ်အပိုင်းအခြား - စာမျက်နှာ {page}",
    "viewer.imageRegionHint":
      "ပုံရိပ်အကွက်အသစ်ဆွဲရန် ဖိဆွဲပါ သို့မဟုတ် သတ်မှတ်ပြီးသားအကွက်သုံးရန် ကလစ်နှိပ်ပါ",
    "snips.kicker": "Visual Snipping",
    "snips.title": "ဖြတ်ညှပ်ထားသော သက်သေခံချက်များ",
    "snips.desc":
      "သက်သေခံချက် အချက်အလက်များစွာကို ဖမ်းယူပြီး အရင်းအမြစ်တစ်ခုချင်းစီကို ဆန်းစစ်ကာ Excel သို့ ပြန်လည်ချိတ်ဆက်ပါ။",
    "snips.statCaptured": "ဖမ်းယူပြီး",
    "snips.statLinked": "ချိတ်ဆက်ပြီး",
    "snips.statOpen": "ကျန်ရှိ",
    "snips.emptyState":
      "ကြည့်ရှုစနစ်တွင် Snip mode ကို ဖွင့်ပြီး သက်သေခံချက်များ စုဆောင်းရန် PDF စာသား သို့မဟုတ် ပုံရိပ်အပိုင်းအခြားများကို ကလစ်နှိပ်ပါ။",
    "snips.goToPage": "{fileName} ၏ စာမျက်နှာ {page} သို့ သွားရန်",
    "snips.linked": "ချိတ်ဆက်ပြီး",
    "snips.needsLink": "ချိတ်ဆက်ရန် လိုအပ်သည်",
    "snips.linkAnother": "အခြားတစ်ခု ချိတ်ဆက်မည်",
    "snips.linkCell": "Cell သို့ ချိတ်ဆက်မည်",
    "snips.unlinkCell": "Excel Cell ချိတ်ဆက်မှု ဖြုတ်မည်",
    "snips.linkTooltip": "ရွေးချယ်ထားသော Excel Cell သို့ ချိတ်ဆက်ရန်",
    "snips.removeTooltip": "ဤ Snip ကို ဖယ်ရှားရန်",
    "snips.sourcePdfWord": "PDF စာလုံး",
    "snips.sourcePdfLine": "PDF စာကြောင်း",
    "snips.sourcePdfTable": "PDF ဇယား",
    "snips.sourcePdfText": "PDF စာသား",
    "snips.sourceManualRegion": "ကိုယ်တိုင် ရွေးချယ်မှု",
    "snips.sourceExtractedSnippet": "ထုတ်ယူထားသော အပိုင်း",
    "snips.sourceGeneric": "Snip",
    "snips.formFieldNone": "အကွက် မရွေးရသေး",
    "snips.formFieldInvoiceNumber": "ပြေစာနံပါတ်",
    "snips.formFieldDate": "ရက်စွဲ",
    "snips.formFieldAmount": "ပမာဏ",
    "snips.formFieldReference": "ကိုးကားချက်",
    "snips.formFieldOther": "အခြား",
    "snips.writeForm": "အကွက်များကို Excel သို့ ရေးမည်",
    "snips.writeFormTooltip":
      "ရွေးချယ်ထားသော cell ကို အပေါ်ဘယ်အဖြစ် Label | Value ရေးရန်",
    "snips.formMixedDocuments":
      "တစ်ခုတည်းသော စာရွက်မှ အကွက်များကိုသာ ရေးနိုင်သည်။",
    "snips.formEmptyTags":
      "Excel သို့ မရေးမီ စကားလုံး သို့မဟုတ် စာကြောင်းကို အကွက် tag တပ်ပါ။",
    "templates.kicker": "ပုံစံခွက်များ (Templates)",
    "templates.title": "လုပ်ငန်းခွင်နှင့် အဖွဲ့လိုက် မျှဝေအသုံးပြုမှုများ",
    "templates.desc":
      "တူညီသော တိုက်ဆိုင်စစ်ဆေးမှုပုံစံများကို အခြား စာရင်းဇယားများနှင့် စာရင်းစစ် ပရောဂျက်များတွင် ပြန်လည်အသုံးပြုပါ။",
    "templates.setups": "ခု သိမ်းဆည်းထားသည်",
    "templates.nameLabel": "ပုံစံခွက်အမည် (Template Name)",
    "templates.placeholder": "ဥပမာ - အထွေထွေအသုံးစရိတ် စစ်ဆေးမှု စံနှုန်း",
    "templates.saving": "သိမ်းဆည်းနေသည်...",
    "templates.save": "Template သိမ်းဆည်းမည်",
    "templates.export": "JSON ထုတ်ယူမည်",
    "templates.importLabel": "သတ်မှတ်ချက်များ တင်သွင်းမည်",
    "templates.savedLibrary": "သိမ်းဆည်းထားသော ပုံစံခွက်များ",
    "templates.deleteTooltip": "Template ဖျက်သိမ်းမည်",
    "templates.tol": "ကွာဟချက် ±",
    "templates.window": "ရက်စွဲဝင်းဒိုး",
    "templates.fields": "ကော်လံများ",
    "templates.apply": "သတ်မှတ်ချက်ကို အသုံးချမည်",
    "templates.emptyTitle": "ပုံစံခွက်များ မရှိသေးပါ",
    "templates.emptyDesc":
      "လက်ရှိ ကော်လံချိတ်ဆက်မှုများနှင့် ကွာဟချက်စံနှုန်းများကို အခြားလုပ်ငန်းခွင်များတွင် ပြန်လည်အသုံးပြုရန် ပုံစံခွက်အဖြစ် သိမ်းဆည်းပါ။",
    "eng.planningScope": "စာရင်းစစ် အစီအစဉ်နှင့် အတိုင်းအတာ (Planning & Scope)",
    "eng.selectEngagementPrompt":
      "အသေးစိတ်အချက်အလက်များနှင့် Dashboard ကိုကြည့်ရှုရန် ဘယ်ဘက်မှ Engagement တစ်ခု ရွေးချယ်ပါ သို့မဟုတ် အသစ်ဖန်တီးပါ။",
    "eng.deleteTitle": "Engagement လုပ်ငန်းကို ဖျက်သိမ်းမလား။",
    "eng.deleteDesc":
      '"{name}" စာရင်းစစ်လုပ်ငန်းကို ဖျက်ရန် သေချာပါသလား။ ဤလုပ်ဆောင်ချက်ကို ပြန်ပြင်၍မရပါ။',
    "eng.deleteBtn": "ဖျက်သိမ်းမည်",
    "eng.cancelBtn": "မလုပ်တော့ပါ",
    "eng.listTitle": "လုပ်ငန်းများ",
    "eng.fw.isa": "ISA (နိုင်ငံတကာစာရင်းစစ်စံနှုန်းများ)",
    "eng.fw.ias_ifrs":
      "IAS / IFRS (နိုင်ငံတကာဘဏ္ဍာရေးအစီရင်ခံတင်ပြမှုစံနှုန်းများ)",
    "eng.fw.ifrs_smes":
      "IFRS for SMEs (အသေးစားနှင့်အလတ်စားလုပ်ငန်းများစံနှုန်း)",
    "eng.status.notStarted": "မစတင်ရသေးပါ",
    "eng.status.inProgress": "လုပ်ဆောင်နေဆဲ",
    "eng.status.pendingClient": "ကလိုင်းယင့်ထံမှ စောင့်ဆိုင်းဆဲ",
    "eng.status.underReview": "စိစစ်နေဆဲ (Under Review)",
    "eng.status.clearedPartner":
      "ပါတနာ စစ်ဆေးရန် အသင့်ဖြစ် (Cleared for Partner)",
    "eng.status.archived": "မော်ကွန်းထိန်းသိမ်းပြီး",
    "eng.status.completed": "ပြီးစီးပါပြီ",
    "app.prev": "နောက်သို့",
    "app.next": "ရှေ့သို့",
    "viewer.liveInspection": "တိုက်ရိုက်စစ်ဆေးဆဲ",
    "viewer.renderingPdf": "PDF ဖိုင်ကို ပြသရန် ပြင်ဆင်နေသည်...",
    "viewer.busySkeletonAria": "PDF ပြသရန် ပြင်ဆင်နေသည်",
    "viewer.detectedMetadata": "အလိုအလျောက်ဖတ်ရှိထားသော Metadata",
    "viewer.invoiceNum": "ပြေစာနံပါတ်",
    "viewer.amountVal": "ပမာဏ",
    "viewer.dateVal": "ရက်စွဲ",
    "viewer.statementEntries": "ဘဏ်ရှင်းတမ်း စာရင်းလိုင်းများ",
    "viewer.relevantSnippets": "ကိုက်ညီသော ဖြတ်ညှပ်ချက်များ",
    "viewer.captureSnippet": "ဤ ဖြတ်ညှပ်ချက်အား ဖမ်းယူရန်",
    "viewer.snipBtn": "ဖြတ်ညှပ်မည်",
    "eng.clientRequired": "ကလိုင်းယင့်အမည် ထည့်သွင်းပေးရန် လိုအပ်သည်",
    "eng.createdSuccess": "Engagement အသစ်ကို အောင်မြင်စွာ ဖန်တီးပြီးပါပြီ",
    "eng.deletedSuccess": "Engagement ကို ဖျက်ပြီးပါပြီ",
    "eng.responded": "အကြောင်းပြန်ပြီး",
    "eng.closed": "ပိတ်သိမ်းပြီး",
    "eng.pbc.uploaded": "တင်သွင်းပြီး (စစ်ဆေးရန်လိုအပ်)",
    "eng.pbc.approved": "အတည်ပြုပြီး သက်သေခံချက်",
    "eng.currency": "ငွေကြေး (Currency)",
    "eng.currencyOther": "အခြား (ISO)",
    "eng.currencyInvalid": "ISO 4217 ကုဒ် ၃ လုံး (ဥပမာ MMK) ထည့်ပါ။",
    "eng.ocrLanguage": "OCR ဘာသာစကား",
    "eng.ocrMyanmarEnglish": "မြန်မာ + အင်္ဂလိပ်",
    "eng.ocrEnglish": "အင်္ဂလိပ်",
    "eng.reportingSaveFailed":
      "Reporting သတ်မှတ်ချက်ကို workbook ထဲသို့ မသိမ်းနိုင်ပါ။",
    "snip.undo": "ပြန်ပြင်ရန်",
    "snip.undone": "Snip ကို ပြန်ထားပြီး",
    "snip.undoExpired": "ပြန်ပြင်ရန် အချိန်ကုန်သွားပါပြီ။",
    "snip.tableLinked": "ဇယားကို Excel သို့ ရေးပြီး",
    "snip.tableReplaced": "ဇယားက အရင် cell များကို အစားထိုးပြီး",
    "snip.formLinked": "ဖောင်အကွက်များကို Excel သို့ ရေးပြီး",
    "snip.formReplaced": "ဖောင်အကွက်က အရင် cell များကို အစားထိုးပြီး",
    "snip.tableDetectFailed":
      "ဤရွေးချယ်မှုမှ ဇယားခွဲမရပါ။ ဧရိယာကို ပြန်ဆွဲပါ သို့မဟုတ် စာလုံး/စာကြောင်းကို ကလစ်နှိပ်ပါ။",
    "snip.noTextLayer": "ဤစာမျက်နှာတွင် ရွေးချယ်နိုင်သော စာသား မရှိပါ။",
    "snip.mergedDestination":
      "ပေါင်းထားသော cell ပေါ် ဇယားမရေးပါ။ အလွတ် cell တစ်ခုကို ရွေးပါ။",
    "snip.undoSessionWeak":
      "စာသားပြန်ပြီး။ Excel click-back ကို ဤ session တွင် မသိမ်းနိုင်ပါ။",
    "viewer.fieldLocationUnavailable":
      "ဤစာမျက်နှာ၏ စာသားအလွှာတွင် ကိုက်ညီသော အကွက်ကို ရှာမတွေ့ပါ။",
    "persist.sessionCacheFailedTitle": "Session cache မအောင်မြင်ပါ",
    "persist.sessionCacheFailedDesc":
      "ဖိုင်သည် ဤ workbook ထဲတွင် ရှိသည်။ IndexedDB က ဤ session အတွက် cache မလုပ်နိုင်ပါ။",
    "persist.evidenceOpenFailedTitle": "သက်သေခံချက် ဖွင့်မရပါ",
    "persist.evidenceOpenFailedDesc":
      "ချိတ်ထားသော ဖိုင်သည် ဤ workbook ထဲတွင် မရှိပါ။",
    "persist.evidenceNotStoredTitle": "သက်သေခံချက် မသိမ်းနိုင်ပါ",
    "persist.evidenceNotStoredWorkbookDesc":
      "ဖိုင်ကို workbook သို့မဟုတ် session cache ထဲ မသိမ်းနိုင်ပါ။",
    "persist.evidenceNotStoredIdbDesc":
      "IndexedDB က ဤဖိုင်ကို မသိမ်းနိုင်ပါ။ ဤ session တွင်သာ ရနိုင်သည်။",
    "persist.workbookEmbedFailedTitle": "Workbook embed မအောင်မြင်ပါ",
    "persist.workbookEmbedFailedDesc":
      "သက်သေခံချက်ကို ဤ session အတွက် IndexedDB ထဲ ထားထားသည်။",
    "persist.templatesLoadFailedTitle": "Template များ ဖတ်မရပါ",
    "persist.templatesLoadFailedFallback": "Workbook template များ မရနိုင်ပါ။",
    "persist.auditLogLoadFailedTitle": "Audit log ဖတ်မရပါ",
    "persist.auditLogLoadFailedFallback":
      "ဝှက်ထားသော ISA log sheet ကို ဖတ်မရပါ။",
    "persist.fileTooLargeTitle": "{name} ကို မသိမ်းနိုင်ပါ",
    "persist.fileTooLargeDesc":
      "ဖိုင်သည် စီမံပြီးနောက် 20 MB ကျော်သဖြင့် workbook ဘေးကင်းရေး ကန့်သတ်ချက်ကို ကျော်သည်။",
    "persist.workbookEmbedUnavailableTitle": "Workbook embed မရနိုင်ပါ",
    "persist.workbookEmbedUnavailableDesc":
      "ဤ Excel host က Custom XML parts မပံ့ပိုးပါ။ သက်သေခံချက်သည် IndexedDB ဖြင့် ဤ session တွင် ရှိသည်။",
    "persist.workbookEvidenceRemoveFailedTitle": "Workbook သက်သေခံချက် ဖယ်မရပါ",
    "persist.workbookEvidenceRemoveFailedFallback":
      "စာရွက်စာတမ်းကို ဤ session မှ ဖယ်ပြီးပါပြီ။",
    "persist.evidenceFileMissingTitle": "သက်သေခံဖိုင် ပျောက်နေသည်",
    "persist.evidenceFileMissingDesc":
      "Parse စာသား ပြန်ရပြီ။ PDF သို့မဟုတ် ပုံ bytes က IndexedDB ထဲ မရှိပါ။",
    "persist.parseCacheMissingTitle": "Parse cache မရှိပါ",
    "persist.parseCacheMissingDesc":
      "စာရွက်စာတမ်းဖိုင်များ ကြည့်နိုင်သေးသည်။ Matching စာသားက IndexedDB ထဲ မရှိသဖြင့် ပြန်မဖတ်ပါ။",
    "persist.workbookEvidenceReadFailedTitle": "Workbook သက်သေခံချက် ဖတ်မရပါ",
    "persist.workbookEvidenceReadFailedFallback":
      "ဤ session အတွက် IndexedDB သို့ ပြန်သုံးသည်။",
    "persist.snipAnchorsRestoreFailedTitle": "Snip anchor များ ပြန်မရပါ",
    "persist.snipAnchorsRestoreFailedFallback":
      "ဤ workbook ထဲရှိ ချိတ်ထားသော cell များကို ဖတ်မရပါ။",
    "persist.evidenceCacheSaveFailedTitle": "Evidence cache မသိမ်းနိုင်ပါ",
    "persist.evidenceCacheSaveFailedDesc":
      "Parse စာသားကို IndexedDB ထဲ မသိမ်းနိုင်ပါ။ ဤ session တွင် စာရွက်စာတမ်းများ ရှိနေသေးသည်။",
    "persist.engagementSaveFailedTitle": "Engagement မသိမ်းနိုင်ပါ",
    "persist.engagementSaveFailedDesc":
      "Browser storage ပြည့်နေသည် သို့မဟုတ် ပိတ်ထားသည်။ သိမ်းပြီးသား evidence bytes က IndexedDB ထဲ ရှိသည်။",
    "match.sampleRequiredTitle": "Sample ရွေးရန် လိုအပ်သည်",
    "match.sampleRequiredMappingDesc":
      "DocTrace က input ကော်လံ အကြံပြုနိုင်ရန် Excel အပိုင်းကို အရင် ဖမ်းပါ။",
    "match.sampleRequiredTbDesc":
      "Matching သို့ မပို့မီ listing အတန်း အနည်းဆုံး တစ်ခုကို မှတ်ပါ။",
    "match.mappingAppliedTitle": "အကြံပြု mapping သုံးပြီး",
    "match.mappingAppliedDesc":
      "ဖမ်းထားသော sample မှ input role နှင့် output ကော်လံများကို ပြန်သတ်မှတ်ပြီး။",
    "match.excelContextTitle": "Excel ဆက်သွယ်မှု လိုအပ်သည်",
    "match.excelContextCaptureDesc":
      "Workbook ရွေးချယ်မှု ဖမ်းရန် DocTrace ကို Excel ထဲတွင် ဖွင့်ပါ။",
    "match.selectionCapturedTitle": "ရွေးချယ်မှု ဖမ်းပြီး",
    "match.selectionCapturedDesc":
      "Matching အတွက် sample အတန်း {count} ခု အသင့်ရှိသည်။",
    "match.selectionFailedTitle": "ရွေးချယ်မှု ဖမ်းမရပါ",
    "match.selectionFailedFallback": "Excel ရွေးချယ်မှုကို ဖတ်မရပါ။",
    "match.tbSampleReadyTitle": "TB sample အသင့်",
    "match.tbSampleReadyDesc":
      "listing အတန်း {count} ခု Matching Step 1 တွင် အသင့်ရှိသည်။",
    "match.noSampleTitle": "Sample မရွေးရသေးပါ",
    "match.noSampleDocsDesc":
      "စာရွက်စာတမ်း Matching မလုပ်မီ Excel sample အပိုင်းကို ဖမ်းပါ။",
    "match.noSampleDesc": "Matching မလုပ်မီ Excel sample အပိုင်းကို ဖမ်းပါ။",
    "match.noEvidenceTitle": "သက်သေခံချက် မတင်သေးပါ",
    "match.noEvidenceRunDesc":
      "Match မလုပ်မီ ပြေစာနှင့် ဘဏ်ရှင်းတမ်းများကို တင်သွင်းပါ။",
    "match.noEvidenceDesc":
      "Matching မလုပ်မီ ပြေစာနှင့် ဘဏ်ရှင်းတမ်းများကို တင်သွင်းပါ။",
    "match.noOutputTitle": "Output အကွက် မရွေးရသေးပါ",
    "match.noOutputDesc":
      "Matching မလုပ်မီ output အကွက် အနည်းဆုံး တစ်ခု ရွေးပါ။",
    "match.outputIncompleteTitle": "Output mapping မပြည့်သေးပါ",
    "match.outputIncompleteBeforeDesc":
      "Matching မလုပ်မီ ဖွင့်ထားသော output အကွက်တိုင်း Excel ကော်လံ လိုအပ်သည်။",
    "match.outputIncompleteDesc":
      "ဖွင့်ထားသော output အကွက်တိုင်း ပစ်မှတ် Excel ကော်လံ လိုအပ်သည်။",
    "match.outputDuplicateTitle": "Output ကော်လံများ ထပ်နေသည်",
    "match.outputDuplicateDesc":
      "ဖွင့်ထားသော output အကွက်တိုင်း မတူသော Excel ကော်လံသို့ ရေးရမည်။",
    "match.completedTitle": "Matching ပြီးပါပြီ",
    "match.completedDesc":
      "sample အတန်း {count} ခု တွက်ပြီး Excel သို့ ပြန်ရေးပြီး။",
    "match.failedTitle": "Matching မအောင်မြင်ပါ",
    "match.failedFallback": "Matching ပြေးခြင်း မပြီးပါ။",
    "match.rowNotFoundTitle": "အတန်း ရှာမတွေ့ပါ",
    "match.rowNotFoundDesc":
      "အတန်း {row} သည် ဖမ်းထားသော ရွေးချယ်မှု အပိုင်း အပြင်တွင် ရှိသည်။",
    "match.rowMatchedTitle": "အတန်း {row} ကိုက်ညီပြီး",
    "match.rowMatchedDesc":
      "အတန်း {row} ကိုက်ညီပြီး ({confidence}% ယုံကြည်မှု)။",
    "match.rowFailedTitle": "အတန်း {row} Matching မအောင်မြင်ပါ",
    "match.excelConnectionTitle": "Excel ချိတ်ဆက်မှု လိုအပ်သည်",
    "match.excelConnectionDesc":
      "လက်ရှိအတန်း Matching ကို Excel ထဲတွင်သာ သုံးနိုင်သည်။",
    "match.outOfBoundsTitle": "ရွေးချယ်မှု အပိုင်းပြင်တွင် ရှိသည်",
    "match.outOfBoundsDesc":
      "Excel cursor ကို ဖမ်းထားသော အပိုင်းထဲ ထားပါ (အတန်း {min} - {max})။",
    "match.activeRowFailedTitle": "လက်ရှိအတန်း Matching မရပါ",
    "match.activeRowFailedFallback": "Excel cursor အတန်းကို ရှာမရပါ။",
    "match.clearedTitle": "Match ရှင်းပြီး",
    "match.clearedExcelDesc": "Match ရလဒ်များကို Excel နှင့် UI မှ ရှင်းပြီး။",
    "match.clearedUiDesc": "Match ရလဒ်များကို UI မှ ရှင်းပြီး။",
    "match.clearFailedTitle": "ရှင်းမရပါ",
    "match.clearFailedFallback": "Excel အပိုင်းကို ရှင်းမရပါ။",
    "wp.sendBlockedTitle": "Workpaper ပို့ခြင်း ပိတ်ထားသည်",
    "wp.sendBlockedDesc": "ဤ engagement ကို လော့ခ်ချထားသည်။",
    "wp.matchRequiredTitle": "Match ရလဒ်များ လိုအပ်သည်",
    "wp.matchRequiredDesc":
      "ToD pack ကို Workpapers သို့ မပို့မီ Matching ပြေးပါ။",
    "wp.packReadyTitle": "ToD pack အသင့်",
    "wp.packReadyDesc": "အတန်း {count} ခု Workpapers အညွှန်းတွင် ရှိသည်။",
    "wp.signBlockedTitle": "Workpaper လက်မှတ်ထိုးခြင်း ပိတ်ထားသည်",
    "wp.signBlockedLockedDesc": "ဤ engagement ကို လော့ခ်ချထားသည်။",
    "wp.signBlockedReviewDesc":
      "Matching Review တွင် exception နှင့် partial အတန်းများကို အရင် လက်မှတ်ထိုးပြီး ပြင်ဆင်သူနှင့် စစ်ဆေးသူ အတိုကောက် ထည့်ပါ။",
    "wp.signedTitle": "Workpaper လက်မှတ်ထိုးပြီး",
    "wp.signedDesc": "{preparer} / {reviewer} က ToD pack ကို လက်မှတ်ထိုးပြီး။",
    "results.signOffExceptionOnly":
      "မကိုက်ညီသော exception အတန်းများကိုသာ လက်မှတ်ထိုးနိုင်သည်။",
    "results.signOffLogFailedTitle": "လက်မှတ်ထိုးမှု မှတ်တမ်းမတင်နိုင်ပါ",
    "results.signOffLogFailedFallback":
      "ဝှက်ထားသော ISA log sheet ကို မပြင်နိုင်ပါ။",
    "template.savedTitle": "Template သိမ်းပြီး",
    "template.savedDesc": "{name} ကို ဤ workbook တွင် သုံးနိုင်သည်။",
    "template.appliedTitle": "Template သုံးပြီး",
    "template.appliedDesc": "{name} ကို ယခု သုံးနေသည်။",
    "template.deletedTitle": "Template ဖျက်ပြီး",
    "template.deletedFallback": "Template ကို ဖယ်ပြီးပါပြီ။",
    "template.exportedTitle": "Template များ ထုတ်ပြီး",
    "template.exportedDesc":
      "Workbook template အစုကို JSON အဖြစ် ဒေါင်းလုဒ်လုပ်ပြီး။",
    "template.importedTitle": "Template များ တင်သွင်းပြီး",
    "template.importedDesc": "Template {count} ခု ယခု သုံးနိုင်သည်။",
    "template.importFailedTitle": "Template တင်သွင်းမှု မအောင်မြင်ပါ",
    "template.importFailedFallback": "ရွေးထားသော template ဖိုင်ကို ဖတ်မရပါ။",
    "snip.emptyIgnoredTitle": "ဗလာ Snip ကို ကျော်သည်",
    "snip.emptyIgnoredDesc":
      "စာသားတန်ဖိုး သို့မဟုတ် အကြောင်းအရာရှိသော သက်သေခံ ဧရိယာ ရွေးပါ။",
    "snip.alreadyCapturedTitle": "Snip ဖမ်းပြီးသား",
    "snip.alreadyCapturedDesc": '"{text}" သည် snip စာရင်းတွင် ရှိပြီး။',
    "snip.addFailedTitle": "Snip ထည့်မရပါ",
    "snip.undoFailedTitle": "Snip ပြန်ပြင်မရပါ",
    "snip.undoFailedFallback": "အရင် Snip ကို ပြန်မထားနိုင်ပါ။",
    "snip.excelContextLinkDesc":
      "Snip များကို cell နှင့် ချိတ်ရန် DocTrace ကို Excel ထဲတွင် ဖွင့်ပါ။",
    "snip.linkFailedTitle": "Snip ချိတ်မရပါ",
    "snip.linkFailedNoDocument":
      "ရင်းမြစ် စာရွက်စာတမ်းသည် ဤ session တွင် မရှိတော့ပါ။",
    "snip.linkFailedFallback": "ရွေးထားသော cell သို့ မရေးနိုင်ပါ။",
    "snip.formWriteFailedTitle": "ဖောင်ရေးခြင်း မအောင်မြင်ပါ",
    "snip.formWriteFailedFallback":
      "မှတ်သားထားသော အကွက်များကို Excel သို့ မရေးနိုင်ပါ။",
    "snip.replacedTitle": "Cell ပေါ်ရှိ Snip ကို အစားထိုးပြီး",
    "snip.linkedTitle": "Snip ချိတ်ပြီး",
    "snip.linkedSessionTitle": "ဤ session တွင် Snip ချိတ်ပြီး",
    "snip.replacedDesc":
      '"{text}" က {cell} ပေါ်ရှိ အရင် Snip ကို အစားထိုးပြီး။',
    "snip.linkedDesc": '"{text}" -> {cell}',
    "snip.hostNoBindingsCells":
      "ဤ Excel host က snip binding မသိမ်းနိုင်ပါ။ Cell များကို ဤ session အတွက်သာ ဖြည့်ပြီး။",
    "snip.hostNoBindingsCell":
      "ဤ Excel host က snip binding မသိမ်းနိုင်ပါ။ Cell ကို ဤ session အတွက်သာ ဖြည့်ပြီး။",
    "snip.hashMissingAnchor":
      "သက်သေခံဖိုင် hash မရှိသဖြင့် ပြန်ဖွင့်နိုင်သော anchor မသိမ်းပါ။",
    "snip.hostTopLeftOnly":
      "ဤ Excel host က ဘယ်အပေါ် cell တစ်ခုသာ ချိတ်သည်။ အခြား ဇယား cell များက PDF ကို ပြန်မဖွင့်နိုင်ပါ။",
    "snip.sessionKeepCellsFallback":
      "Cell များကို ဤ session အတွက် ဖြည့်ပြီး။ Workbook က snip တည်နေရာ မသိမ်းပါ။",
    "snip.sessionKeepCellFallback":
      "Cell ကို ဤ session အတွက် ဖြည့်ပြီး။ Workbook က snip တည်နေရာ မသိမ်းပါ။",
    "app.runtimeError": "Runtime အမှား",
    "app.unhandledRejection": "မကိုင်တွယ်သော promise ငြင်းပယ်မှု",
    "identity.readFailedFallback": "Workbook အတိုကောက်များကို ဖတ်မရပါ။",
    "identity.saveFailedFallback": "Workbook အတိုကောက်များကို မသိမ်းနိုင်ပါ။",
    "eng.reportingReadFailedFallback": "Workbook reporting ကို ဖတ်မရပါ။",
    "eng.reportingSaveFailedFallback": "Workbook reporting ကို မသိမ်းနိုင်ပါ။",
    "activity.sessionCacheFailedDesc":
      "Workbook embed အောင်မြင်သည်။ IndexedDB cache မအောင်မြင်ပါ။",
    "activity.evidenceNotStoredBothDesc":
      "Workbook embed နှင့် IndexedDB နှစ်ခုလုံး မအောင်မြင်ပါ။",
    "activity.evidenceNotStoredIdbDesc": "IndexedDB blob persist မအောင်မြင်ပါ။",
    "activity.templatesLoadedTitle": "Workbook template များ ဖတ်ပြီး",
    "activity.templatesLoadedDesc":
      "Template {count} ခု ဤ workbook တွင် သုံးနိုင်သည်။",
    "activity.templatesFailedTitle": "Workbook template များ မအောင်မြင်ပါ",
    "activity.mappingBlockedTitle": "အကြံပြု mapping ပိတ်ထားသည်",
    "activity.mappingBlockedDesc": "Excel sample မရှိသေးပါ။",
    "activity.mappingAppliedDesc": "ဖမ်းထားသော ကော်လံ {count} ခု ချိတ်ပြီး။",
    "activity.selectionBlockedTitle": "ရွေးချယ်မှု ဖမ်းခြင်း ပိတ်ထားသည်",
    "activity.selectionBlockedDesc":
      "Add-in သည် Excel host နှင့် မချိတ်ဆက်ရသေးပါ။",
    "activity.capturingSelectionTitle": "Excel ရွေးချယ်မှု ဖမ်းနေသည်",
    "activity.selectionCapturedDesc":
      "{address} သည် mapping အတွက် အသင့်ရှိသည်။",
    "activity.selectionCapturedEmptyTitle":
      "ရွေးချယ်မှု ဖမ်းပြီး sample အတန်း မရှိပါ",
    "activity.selectionCapturedEmptyDesc":
      "Header အောက်တွင် ဒေတာအတန်း အနည်းဆုံး တစ်ခု ရွေးပြီး ပြန်ဖမ်းပါ။",
    "activity.tbBlockedTitle": "TB sample ပိတ်ထားသည်",
    "activity.tbBlockedDesc": "Listing အတန်း မမှတ်ရသေးပါ။",
    "activity.tbSentTitle": "TB sample ကို Matching သို့ ပို့ပြီး",
    "activity.tbSentDesc": "{sheet} မှ အတန်း {count} ခု။",
    "activity.todBlockedTitle": "ToD workpaper ပိတ်ထားသည်",
    "activity.todBlockedLockedDesc": "Engagement ကို လော့ခ်ချထားသည်။",
    "activity.todBlockedNoResultsDesc": "စုစည်းရန် Match ရလဒ် မရှိပါ။",
    "activity.todSentTitle": "ToD ကို Workpapers သို့ ပို့ပြီး",
    "activity.todSentDesc": "အတန်း {count} ခု၊ snip {snips} ခု။",
    "activity.signBlockedLockedDesc": "Engagement ကို လော့ခ်ချထားသည်။",
    "activity.signBlockedUnsignedDesc":
      "Exception လက်မှတ်မထိုးရသေး သို့မဟုတ် identity မပြည့်ပါ။",
    "activity.workpaperFileSignedTitle": "Workpaper ဖိုင် လက်မှတ်ထိုးပြီး",
    "activity.identityPairDesc": "{preparer} / {reviewer}။",
    "activity.fileTooLargeDesc":
      "သက်သေခံချက်သည် workbook ဘေးကင်းရေး ကန့်သတ်ချက် 20 MB ကို ကျော်သည်။",
    "activity.invoicePickerDismissed": "ပြေစာ picker ပိတ်လိုက်သည်",
    "activity.bankPickerDismissed": "ဘဏ် picker ပိတ်လိုက်သည်",
    "activity.evidenceRemovedTitle": "သက်သေခံချက် ဖယ်ပြီး",
    "activity.matchBlockedTitle": "Matching ပိတ်ထားသည်",
    "activity.matchBlockedNoSampleDesc": "Excel sample မဖမ်းရသေးပါ။",
    "activity.matchBlockedNoEvidenceDesc": "သက်သေခံစာရွက်စာတမ်း မတင်ရသေးပါ။",
    "activity.matchBlockedNoOutputDesc": "Output အကွက် မဖွင့်ရသေးပါ။",
    "activity.matchBlockedIncompleteDesc":
      "ဖွင့်ထားသော output အကွက်အချို့တွင် ပစ်မှတ် Excel ကော်လံ မရှိသေးပါ။",
    "activity.matchBlockedDuplicateDesc":
      "ထပ်နေသော Excel output ကော်လံများ တွေ့သည်။",
    "activity.matchingRunningTitle": "Deterministic Matching ပြေးနေသည်",
    "activity.matchingRunningDesc":
      "sample အတန်း {rows} ခုနှင့် စာရွက်စာတမ်း {docs} ခု။",
    "activity.workerFallbackTitle": "Matching worker fallback",
    "activity.matchingCompletedDesc":
      "အတန်း {count} ခု တွက်ပြီး၊ ပြည့်စုံကိုက်ညီမှု {matched} ခု။",
    "activity.singleRowRunningTitle": "အတန်းတစ်ခု Matching ပြေးနေသည်",
    "activity.singleRowRunningDesc": "{sheet} မှ အတန်း {row}။",
    "activity.rowMatchedDesc": "အခြေအနေ: {status}၊ ယုံကြည်မှု: {confidence}%။",
    "activity.matchClearedDesc":
      "Match ရလဒ်များကို Excel နှင့် UI မှ ရှင်းပြီး။",
    "activity.signOffRowDesc": "အတန်း {row}: {action}",
    "activity.templatesImportedDesc": "{name} မှ template {count} ခု ဖတ်ပြီး။",
    "activity.viewerFocusedTitle": "Viewer အာရုံစိုက်ပြီး",
    "activity.viewerFocusedFallback": "သက်သေခံ အကြိုကြည့် ပြင်ပြီး။",
    "activity.duplicateSnipTitle": "ထပ်နေသော Snip ကို အာရုံစိုက်ပြီး",
    "activity.duplicateSnipDesc": '"{text}" ကို ဖမ်းပြီးသား။',
    "activity.textSnippedTitle": "စာသား Snip ပြီး",
    "activity.textSnippedDesc": '"{text}" — {name}',
    "activity.ocrActiveTitle": "စာသား ထုတ်ယူနေသည်",
    "activity.ocrActiveDesc": "ပုံဧရိယာပေါ် OCR ပြေးနေသည်...",
    "activity.ocrExtractedTitle": "ဧရိယာမှ စာသား ထုတ်ပြီး",
    "activity.ocrExtractedDesc":
      '"{text}" က ကိုဩဒိနိတ် placeholder ကို အစားထိုးပြီး။',
    "activity.ocrFailedTitle": "စာသား ထုတ်ယူမှု မအောင်မြင်ပါ",
    "activity.ocrFailedDesc": "ရွေးထားသော ဧရိယာမှ စာသား မထုတ်နိုင်ပါ။",
    "activity.snipUndoneTitle": "Snip ပြန်ပြင်ပြီး",
    "activity.tableSnipLinkedTitle": "ဇယား Snip ကို cell များနှင့် ချိတ်ပြီး",
    "activity.formFieldsWrittenTitle":
      "ဖောင်အကွက်များကို cell များသို့ ရေးပြီး",
    "activity.snipReplacedTitle": "Cell ပေါ်ရှိ Snip ကို အစားထိုးပြီး",
    "activity.snipLinkedToCellTitle": "Snip ကို cell နှင့် ချိတ်ပြီး",
    "activity.snipModeOnTitle": "Snip mode ဖွင့်ပြီး",
    "activity.snipModeOffTitle": "Snip mode ပိတ်ပြီး",
    "activity.snipModeOnDesc":
      "PDF စာသား၊ ပုံဧရိယာ၊ သို့မဟုတ် viewer snippet ကို ကလစ်နှိပ်၍ သက်သေခံချက် ဖမ်းပါ။",
    "activity.snipModeOffDesc":
      "ဖမ်းပြီးသား snip များသည် snip စစ်ဆေး panel တွင် ရှိနေသေးသည်။",
    "activity.snipFocusedTitle": "Snip အာရုံစိုက်ပြီး",
    "activity.snipFocusedDesc": "{name} စာမျက်နှာ {page}",
    "activity.snipRemovedTitle": "Snip ဖယ်ပြီး",
    "activity.snipLinkRemovedTitle": "Snip ချိတ် ဖယ်ပြီး",
    "activity.sessionRestoredTitle": "Session ပြန်ထားပြီး",
    "activity.sessionRestoredDesc":
      "ယခင် browser session ဒေတာကို IndexedDB မှ ဖတ်ပြီး။",
    "app.officeBootstrapFallback": "Office bootstrap fallback",
    "app.officeReadyFailedFallback":
      "Office အသင့်ဖြစ်မှု စစ်ဆေးခြင်း မအောင်မြင်ပါ။",
  },
  "en-US": {
    "app.skip": "Skip to main content",
    "app.workspace": "Excel audit workspace",
    "app.excelConnected": "Excel connected",
    "app.browserPreview": "Browser preview",
    "app.website": "Website",
    "app.booting": "Booting",
    "app.bootSkeletonAria": "Office is still starting",
    "app.crashTitle": "Something went wrong",
    "app.crashLead":
      "Matching in the workbook may still be there. Reload this pane.",
    "app.crashReload": "Reload pane",
    "app.crashAria": "The task pane hit an error",
    "app.description":
      "Deterministic document matching for Test of Details workflows, built for audit teams working directly in Excel.",
    "app.selection": "Selection",
    "app.documents": "Documents",
    "app.results": "Results",
    "app.status": "Status",
    "app.none": "None",
    "app.ready": "Ready",
    "app.language": "Language",
    "app.langSwitch": "မြန်မာ",
    "app.langSwitchAria": "Switch to Myanmar",
    "cloud.session": "Account",
    "cloud.email": "Email",
    "cloud.otp": "Code",
    "cloud.sendCode": "Send code",
    "cloud.verifyCode": "Verify code",
    "cloud.otpHint": "Until mail is live, use 123456.",
    "cloud.backToEmail": "Back to email",
    "cloud.login": "Sign in",
    "cloud.register": "Create account",
    "cloud.logout": "Sign out",
    "cloud.failed": "Cloud sign-in failed. Matching still works.",
    "cloud.skipped": "API URL is not set.",
    "cloud.invalid": "Enter an email address.",
    "cloud.invalidCode": "Enter the 6-digit code.",
    "cloud.otpNotLive": "OTP mail is not live. Matching still works.",
    "cloud.userNotFound": "No account exists for this email.",
    "cloud.emailTaken": "An account already exists for this email.",
    "cloud.cooldown": "Wait a moment, then send again.",
    "cloud.signedIn": "Signed in",
    "cloud.backup": "Backup",
    "cloud.mail": "Mail",
    "cloud.backupOk": "Backup finished.",
    "cloud.mailOk": "Notice sent.",
    "cloud.backupFailed": "Cloud backup failed. Matching still works.",
    "cloud.mailFailed": "Cloud mail failed. Matching still works.",
    "cloud.noEvidence": "No document is available to back up.",
    "cloud.restore": "Restore",
    "cloud.restoreOk": "Restore finished.",
    "cloud.restoreFailed": "Cloud restore failed. Matching still works.",
    "cloud.templates": "Templates",
    "cloud.templatesNotLive":
      "Organization template sync is not live. Matching still works.",
    "cloud.templatesFailed": "Template sync failed. Matching still works.",
    "cloud.firmRole": "Role",
    "cloud.firmRoleLocal": "Local operator",
    "cloud.firmAccessNotLive": "Firm roles are not live. Matching still works.",
    "cloud.mfa": "MFA",
    "cloud.mfaNotLive": "MFA is not live. Matching still works.",
    "cloud.assist": "AI assist",
    "cloud.assistNotLive": "AI assist is not live. Matching still works.",
    "cloud.assistGovernance":
      "When live, outputs stay reviewable, logged, and overridable.",
    "cloud.admin": "Admin",
    "cloud.adminRoster": "Roster",
    "cloud.adminDeploy": "Deploy",
    "cloud.adminNotLive":
      "Admin roster and deploy are not live. Matching still works.",
    "cloud.adminFailed": "Admin console failed. Matching still works.",
    "pbc.uploadToImport": "Upload to Import",
    "pbc.markReceived": "Mark received",
    "pbc.received": "Received",
    "pbc.todHint": "PDF, image, or JSON goes to Matching Import.",
    "pbc.listOnlyHint": "Stays on this list. Not imported to Matching.",
    "pbc.kicker": "Client Communication Portal",
    "pbc.title": "Client PBC Portal & Requests",
    "pbc.subtitle":
      "Track and verify document request templates prepared by the client (PBC) for audit testing.",
    "pbc.statPending": "Pending PBC",
    "pbc.statUploaded": "Uploaded / Unreviewed",
    "pbc.statApproved": "Approved & Audit-Ready",
    "pbc.checklist": "Active PBC Checklist ({count} requested)",
    "pbc.idLabel": "ID:",
    "pbc.deadlineLabel": "Deadline:",
    "pbc.uploadedFile": "Uploaded File",
    "pbc.approve": "Approve",
    "pbc.reject": "Reject",
    "pbc.removeFile": "Remove file",
    "pbc.statusPending": "Pending",
    "pbc.statusUploaded": "Uploaded",
    "pbc.statusApproved": "Approved",
    "pbc.statusRejected": "Rejected",
    "pbc.catAccountsPayable": "Accounts Payable",
    "pbc.catCashBank": "Cash & Bank",
    "pbc.catExpenses": "Expenses",
    "pbc.catFixedAssets": "Fixed Assets",
    "pbc.catGovernance": "Governance",
    "pbc.whatTitle": "What is a PBC List?",
    "pbc.whatBody":
      "PBC stands for Prepared by Client. It is the request list of documents the audit team asks the client to provide. ToD invoice and bank PDF, image, or JSON can go to Matching Import. Ledgers, confirmations, minutes, trial balance, and spreadsheets stay on this list.",
    "tb.importTb": "Import trial balance",
    "tb.importListing": "Import listing",
    "tb.sendToMatching": "Send to Matching",
    "tb.pickLead": "Select lead",
    "tb.tieOutOk": "Listing agrees to the TB lead.",
    "tb.tieOutWarn":
      "Listing does not agree to the TB lead. You can still send the sample.",
    "tb.parseFailed":
      "Could not read that spreadsheet. Check required headers and try again.",
    "tb.sendHint":
      "Map a lead, tick listing rows, then send them to Matching Step 1. Debit-equals-credit does not block the sample.",
    "tb.selectAll": "Select all in view",
    "tb.listingEmpty": "No listing rows for this lead yet.",
    "tb.kicker": "Trial Balance Module",
    "tb.title": "Trial Balance Verification",
    "tb.subtitle":
      "Import audit trial balances, map ledger accounts, and verify mathematical accuracy.",
    "tb.balanceOk": "Balance Status: Ledger Balanced",
    "tb.balanceWarn": "Balance Status: Ledger Imbalance",
    "tb.balanceHint":
      "Total Debits and Total Credits are shown. A mismatch does not block sending the sample.",
    "tb.debits": "Debits:",
    "tb.credits": "Credits:",
    "tb.mappings": "Ledger Account Mappings",
    "tb.searchPlaceholder": "Search code or name...",
    "tb.colCode": "Code",
    "tb.colDescription": "Account Description",
    "tb.colDebit": "Debit",
    "tb.colCredit": "Credit",
    "tb.colMapping": "F/S Group Mapping",
    "tb.colInvoice": "Invoice",
    "tb.colDate": "Date",
    "tb.colAmount": "Amount",
    "tb.guidelinesTitle": "Send a listing sample to Matching",
    "results.sendToWorkpapers": "Send to Workpapers",
    "wp.signFile": "Sign workpaper",
    "wp.fileHint":
      "Send ToD results from Matching Review, sign exception and partial rows, then sign the file. Follow-up is visible and does not block.",
    "wp.unsignedHint":
      "Sign exception or partial rows in Matching Review before signing this file.",
    "wp.followUpWarn":
      "Follow-up rows are documented. You can still sign the file.",
    "wp.snipCount": "Snips",
    "wp.noSnips": "No snips in this pack yet.",
    "wp.minutesTitle": "PBC minutes",
    "wp.minutesEmpty": "No minutes on this file yet.",
    "wp.kicker": "Audit Documentation",
    "wp.title": "Audit Workpapers Checklist",
    "wp.subtitle":
      "Manage workpaper sign-offs, preparer assignments, and overall execution progress.",
    "wp.feedbackKicker": "Auditor Feedback",
    "wp.feedbackTitle": "Outstanding Review Notes",
    "wp.feedbackSubtitle":
      "Clear manager and partner notes to finalize document sign-offs.",
    "wp.notesCount": "{count} Notes",
    "wp.assigned": "Assigned: {preparer} (Prep) | {reviewer} (Review)",
    "wp.workpaperLabel": "Workpaper:",
    "wp.reviewerLabel": "Reviewer:",
    "wp.responseLabel": "Response:",
    "wp.respond": "Respond",
    "wp.clearClose": "Clear & Close",
    "wp.cancel": "Cancel",
    "wp.submit": "Submit",
    "wp.responsePlaceholder": "Type your audit response details...",
    "wp.statusNotStarted": "Not Started",
    "wp.statusInProgress": "In Progress",
    "wp.statusReadyForReview": "Ready for Review",
    "wp.statusApproved": "Approved",
    "wp.noteOpen": "Open",
    "wp.noteResponded": "Responded",
    "wp.noteClosed": "Closed",
    "app.browserWarning":
      "Browser preview mode is active. Open DocTrace inside Excel to capture worksheet selections, write mapped output columns, and update the hidden audit log.",
    "project.kicker": "ABOUT DOCTRACE",
    "project.title": "Automated Document Matching Engine",
    "project.description":
      "Deterministic verification of ledger rows against supporting invoices and bank statements.",
    "project.invoiceTitle": "Invoice-side evidence",
    "project.invoiceBody":
      "Digital PDFs are parsed directly, scanned evidence falls back to local OCR, and structured data imports are supported for automated verification.",
    "project.statementTitle": "Statement-side traceability",
    "project.statementBody":
      "Bank statement lines are parsed into date, amount, and reference candidates, then written into mapped worksheet columns with a workbook audit log.",
    "results.kicker": "Step 4",
    "results.title": "Review matched outputs",
    "results.description":
      "Analyze discrepancies, view evidence, and export audit trails.",
    "results.exportCsv": "Export CSV",
    "results.rows": "rows",
    "results.showingRows": "Showing",
    "results.loadMore": "Load more rows",
    "results.matched": "Matched",
    "results.partial": "Partial",
    "results.exception": "Exception",
    "results.confidence": "Confidence",
    "results.discrepancy": "Discrepancy Analysis",
    "results.row": "Row",
    "results.score": "Score",
    "results.invoiceEvidence": "Invoice Evidence",
    "results.bankEvidence": "Bank Evidence",
    "results.noLinkedSource": "No linked source",
    "results.inspectTrace": "Inspect in pane",
    "results.noResults": "No results yet",
    "results.noResultsDescription":
      "Run a document match in Step 3 to generate discrepancies and reviewable audit trails.",
    "results.busySkeletonAria": "Matching in progress",
    "results.clearlyTrivial": "Clearly Trivial Discrepancy",
    "results.belowPerformance": "Below Performance Materiality",
    "results.materialException": "Material Exception",
    "results.aboveOverall": "Above Overall Materiality",
    "results.unassessed": "Unassessed (thresholds missing)",
    "results.discrepancyAmount": "Discrepancy Amount",
    "results.materialityAssessment": "Materiality Assessment",
    "status.matched": "Matched",
    "status.partial": "Partial",
    "status.exception": "Exception",
    "nav.matching": "🛠️ Matching Workspace",
    "nav.engagements": "📊 Engagement Dashboard",
    "nav.trialBalance": "⚖️ Trial Balance",
    "nav.workpapers": "📁 Workpapers",
    "nav.clientPortal": "🌐 Client Portal",
    "eng.title": "Audit Engagements & Dashboard",
    "eng.kicker": "DocTrace Modules",
    "eng.new": "Create New Engagement",
    "eng.clientName": "Client Name",
    "eng.financialYear": "Financial Year",
    "eng.framework": "Auditing Framework",
    "eng.status": "Status",
    "eng.create": "Create",
    "eng.cancel": "Cancel",
    "eng.team": "Audit Team Assignment",
    "eng.partner": "Engagement Partner",
    "eng.manager": "Audit Manager",
    "eng.senior": "Senior Auditor",
    "eng.associate": "Audit Associate",
    "eng.progress": "Audit Progress",
    "eng.workpapers": "Workpapers Done",
    "eng.reviewNotes": "Outstanding Review Notes",
    "eng.pbcRequests": "Client PBC Requests",
    "eng.delete": "Delete",
    "eng.eqReviewer": "EQ Reviewer (Quality Reviewer)",
    "eng.overallMateriality": "Overall Materiality",
    "eng.performanceMateriality": "Performance Materiality",
    "eng.trivialThreshold": "Trivial Threshold",
    "eng.lock": "Lock Engagement",
    "eng.unlock": "Unlock Engagement",
    "eng.locked": "Locked",
    "eng.unlocked": "Unlocked",
    "eng.wizard.title": "Engagement Setup Wizard",
    "eng.wizard.step1": "Basic Info",
    "eng.wizard.step2": "Materiality & Scope",
    "eng.wizard.step3": "Team Assignment",
    "eng.wizard.step4": "Summary & Confirm",
    "eng.wizard.next": "Next",
    "eng.wizard.back": "Back",
    "eng.wizard.finish": "Finish",
    "eng.wizard.progress": "Step {current} of {total}",
    "eng.placeholder.clientExample": "e.g. TZ Assurance Client A",
    "eng.placeholder.epName": "EP Name",
    "eng.placeholder.emName": "EM Name",
    "eng.placeholder.seniorInCharge": "Senior In-Charge",
    "eng.placeholder.associate": "Associate Name",
    "eng.placeholder.eqReviewer": "EQ Reviewer Name",
    "eng.placeholder.iso": "ISO",
    "eng.placeholder.partner": "Partner Name",
    "eng.placeholder.manager": "Manager Name",
    "eng.placeholder.senior": "Senior Name",
    "workflow.kicker": "Workflow",
    "workflow.title": "Document Matching Workflow",
    "workflow.desc":
      "Progress overview only. Use the interactive controls above to run each step.",
    "workflow.step1Title": "Capture sample",
    "workflow.step1Desc": "Select sample rows from Excel",
    "workflow.step2Title": "Import evidence",
    "workflow.step2Desc": "Load invoices and bank statements",
    "workflow.step3Title": "Configure match",
    "workflow.step3Desc": "Map columns and set thresholds",
    "workflow.step4Title": "Review output",
    "workflow.step4Desc":
      "Review results. Inspect opens that row's source in the inspection pane — not as Step 4.",
    "workflow.step1Short": "Select",
    "workflow.step2Short": "Import",
    "workflow.step3Short": "Match",
    "workflow.step4Short": "Review",
    "firstrun.body": "Select sample rows, import evidence, match, then review.",
    "firstrun.gotIt": "Got it",
    "firstrun.skip": "Skip",
    "app.working": "Working...",
    "app.enabled": "Enabled",
    "app.disabled": "Disabled",
    "app.preview": "Preview",
    "app.remove": "Remove",
    "app.yes": "Yes",
    "app.no": "No",
    "app.notice": "Notice",
    "app.success": "Success",
    "app.error": "Error",
    "selection.step": "Step 1",
    "selection.title": "Select your sample data",
    "selection.headersTitle": "First row includes headers",
    "selection.headersDesc": "Recommended for deterministic field mapping.",
    "selection.address": "Address",
    "selection.sheet": "Sheet",
    "selection.rowsCount": "Rows",
    "selection.columnsCount": "Columns",
    "selection.col": "Col",
    "selection.showingSubset": "Showing first 5 of {rowCount} rows",
    "selection.emptyState":
      "Select a sample range in Excel, then capture it here to unlock matching.",
    "selection.captureBtn": "Capture selection",
    "import.step": "Step 2",
    "import.title": "Import your evidence",
    "import.desc":
      "PDF, images, and JSON land in this library. Preview opens the page in the inspection pane.",
    "import.invoiceEvidence": "Invoice Evidence",
    "import.invoiceDesc": "PDFs, scans, or JSON bundles",
    "import.browseInvoices": "Browse invoices",
    "import.bankStatements": "Bank Statements",
    "import.bankDesc": "Transaction scans or exports",
    "import.browseBank": "Browse bank files",
    "import.jsonSupportTitle": "JSON Evidence Support",
    "import.jsonSupportDesc":
      "DocTrace automatically imports multi-document JSON payloads into the matching workflow. Choose your JSON file via Browse to import.",
    "import.busySkeletonAria": "Importing documents",
    "import.invoiceLibrary": "Invoices Library",
    "import.bankLibrary": "Bank statements Library",
    "import.pageImported": "page(s) - Imported",
    "import.docCount": "{count} document(s)",
    "import.fileCount": "{count} file(s)",
    "import.id": "ID",
    "import.amount": "Amount",
    "import.date": "Date",
    "import.jsonSource": "JSON Source",
    "import.emptyState":
      "No files in this folder. Import some evidence to get started.",
    "import.rename": "Rename",
    "import.download": "Download",
    "import.downloadStoredHint":
      "Stored copy. It may be smaller than the original file.",
    "import.downloadFailed": "The file could not be saved",
    "import.downloadHostUnconfirmed":
      "This Excel host may have blocked the save. Preview still works.",
    "import.renameInvalid": "That file name is not valid",
    "import.renameSessionOnly":
      "The name changed in this session. The workbook index was not updated.",
    "import.busyInvoice": "Parsing {count} invoice document(s)",
    "import.busyBank": "Parsing {count} bank statement document(s)",
    "import.activityInvoice": "Importing invoice evidence",
    "import.activityBank": "Importing bank statement evidence",
    "import.activitySelected": "{count} file(s) selected.",
    "import.activityImported": "Evidence imported",
    "import.activityNone": "No evidence was extracted",
    "import.activityImportedDesc":
      "{count} parsed document(s) are ready in the sidebar.",
    "import.activityNoneDesc":
      "The selected files were read, but no parsed evidence records were produced.",
    "import.summarySuccessTitle": "Documents imported",
    "import.summarySuccessDesc":
      "{count} parsed document(s) are ready for review and matching.",
    "import.summaryNoneTitle": "No evidence imported",
    "import.summaryNoneDesc":
      "The selected files were read, but no parsed evidence records were produced.",
    "import.summaryMixedTitle": "Import finished with errors",
    "import.summaryMixedDesc": "{count} imported, {failed} failed.",
    "import.parseFailedTitle": "{name} could not be parsed",
    "import.parseFailedDesc": "No extraction data was produced.",
    "import.unsupportedType":
      "This file type is not supported. Use PDF, JSON, PNG, JPG, JPEG, BMP, GIF, or TIFF.",
    "import.failedTitle": "Import failed",
    "import.failedDesc": "The selected files could not be imported.",
    "import.statusParsed": "Parsed",
    "import.statusError": "Error",
    "import.statusParsing": "Parsing",
    "import.statusIdle": "Idle",
    "config.step": "Step 3",
    "config.title": "Finalize your document match",
    "config.desc":
      "Configure how DocTrace should match and write back to your workbook.",
    "config.suggested": "Suggested mapping",
    "config.sourceColumns": "Source Columns",
    "config.amountCol": "Amount column",
    "config.dateCol": "Date column",
    "config.refCol": "Invoice/reference column",
    "config.selectCol": "Select a column",
    "config.matchingLogic": "Matching Logic",
    "config.amountTol": "Amount tolerance",
    "config.amountTolPercent": "Amount tolerance (%)",
    "config.dateTol": "Date tolerance (days)",
    "config.scoreWeights": "Confidence weights",
    "config.scoreWeightsHint":
      "Relative weights. They do not need to sum to 100.",
    "config.weightInvoice": "Invoice number",
    "config.weightAmount": "Amount",
    "config.weightDate": "Date",
    "config.requireInvoice": "Require invoice alignment",
    "config.allowFuzzy": "Allow fuzzy text matching",
    "config.outputFields": "Output Fields",
    "config.enabledCount": "enabled",
    "config.excelMapping": "Excel Output Mapping",
    "config.targets": "targets",
    "config.writesInto": "Writes into",
    "config.selectTarget": "Select target column",
    "config.emptyState":
      "Capture the Excel sample first to unlock editor-side output mapping.",
    "config.readyMatch": "Ready to match",
    "config.loadedSummary":
      "{invoiceCount} invoice(s) and {bankCount} bank statement(s) loaded.",
    "config.matchActive": "Match active row",
    "config.matchAll": "Match all rows",
    "config.identityTitle": "Preparer and reviewer initials",
    "config.preparer": "Preparer",
    "config.reviewer": "Reviewer",
    "config.preparerPlaceholder": "e.g. KZ",
    "config.reviewerPlaceholder": "e.g. AY",
    "config.out.invoiceDocument": "Invoice document",
    "config.out.invoiceAmount": "Invoice amount",
    "config.out.invoiceDate": "Invoice date",
    "config.out.invoiceNumber": "Invoice number",
    "config.out.bankDocument": "Bank document",
    "config.out.bankAmount": "Bank amount",
    "config.out.bankDate": "Bank date",
    "config.out.bankReference": "Bank reference",
    "config.out.status": "Status",
    "config.out.confidence": "Confidence",
    "results.clear": "Clear match",
    "results.rematch": "Re-match",
    "results.signOff": "Exception sign-off",
    "results.signOffComment": "Comment",
    "results.signOffCommentPlaceholder":
      "Explain why this exception is concluded, waived, or followed up",
    "results.conclude": "Conclude",
    "results.waive": "Waive",
    "results.followUp": "Follow-up",
    "results.signedOff": "Signed off",
    "results.rowLocked": "This row is locked",
    "identity.requiredTitle": "Initials required",
    "identity.requiredDescription":
      "Enter preparer and reviewer initials before matching.",
    "identity.sameNameTitle": "Same preparer and reviewer",
    "identity.sameNameDescription":
      "Allowed in this release. A separate reviewer can be filled in later.",
    "identity.saveFailed": "Initials could not be saved to the workbook.",
    "results.signOffSuccessTitle": "Exception signed off",
    "results.signOffSuccessDescription":
      "This row is locked against rematch and Excel overwrite.",
    "results.lockedRematchTitle": "Row is locked",
    "results.lockedRematchDescription": "Signed-off rows cannot be rematched.",
    "results.averageConfidence": "Average Confidence",
    "results.discrepancyCount": "Total Discrepancies",
    "activity.kicker": "Live activity",
    "activity.title": "What DocTrace is doing now",
    "activity.desc":
      "Every click reports here so Excel-side failures are visible without opening DevTools.",
    "activity.events": "event(s)",
    "activity.emptyState":
      "Click a workflow action and the results will appear here.",
    "activity.justNow": "just now",
    "viewer.kicker": "Inspection pane",
    "viewer.title": "Evidence inspection",
    "viewer.desc":
      "View, zoom, snip, and link source pages to Excel. This pane is not a workflow step.",
    "viewer.noPreview": "No active preview",
    "viewer.expand": "Expand",
    "viewer.collapse": "Collapse",
    "viewer.backToWorkflow": "Back to workflow",
    "viewer.zoomFit": "Fit",
    "viewer.zoomOut": "Zoom out",
    "viewer.zoomIn": "Zoom in",
    "viewer.zoomLabel": "Zoom",
    "viewer.snipModeOn": "Snip mode on",
    "viewer.snipModeOff": "Start snipping",
    "viewer.snipModeOnTitle": "Disable snipping mode",
    "viewer.snipModeOffTitle":
      "Enable snipping mode to capture PDF text, image regions, or snippets",
    "viewer.onPage": "on page",
    "viewer.snipHint":
      "Click a word. Double-click a line. Drag to capture a table. Captured snips stay in the list below.",
    "viewer.activeSnip": "Active snip",
    "viewer.linkToCell": "Link to cell",
    "viewer.linkToCellTitle":
      "Write this snipped text to the currently selected Excel cell",
    "viewer.removeSnip": "Remove",
    "viewer.emptyState":
      "Preview a library file or Inspect a matched row to open this pane.",
    "viewer.pdfFailed": "PDF preview failed.",
    "viewer.fileNotFound":
      "Document file not found in local storage. Please re-upload the document.",
    "viewer.extractedSnippet": "extracted-snippet",
    "viewer.manualSnip": "manual-snip",
    "viewer.imageRegion": "Image region - page {page}",
    "viewer.imageRegionHint":
      "Drag to draw a custom image region, or click to use default box",
    "snips.kicker": "Visual Snipping",
    "snips.title": "Snip review queue",
    "snips.desc":
      "Capture multiple evidence points, review each source, then link the right values back to Excel.",
    "snips.statCaptured": "Captured",
    "snips.statLinked": "Linked",
    "snips.statOpen": "Open",
    "snips.emptyState":
      "Turn on Snip mode in the viewer, then click PDF text, image regions, or extracted snippets to build your evidence queue.",
    "snips.goToPage": "Go to page {page} of {fileName}",
    "snips.linked": "Linked",
    "snips.needsLink": "Needs link",
    "snips.linkAnother": "Link another",
    "snips.linkCell": "Link cell",
    "snips.unlinkCell": "Unlink this Excel cell",
    "snips.linkTooltip": "Link to the selected Excel cell",
    "snips.removeTooltip": "Remove this snip",
    "snips.sourcePdfWord": "PDF word",
    "snips.sourcePdfLine": "PDF line",
    "snips.sourcePdfTable": "PDF table",
    "snips.sourcePdfText": "PDF text",
    "snips.sourceManualRegion": "Manual region",
    "snips.sourceExtractedSnippet": "Extracted snippet",
    "snips.sourceGeneric": "Snip",
    "snips.formFieldNone": "No field",
    "snips.formFieldInvoiceNumber": "Invoice number",
    "snips.formFieldDate": "Date",
    "snips.formFieldAmount": "Amount",
    "snips.formFieldReference": "Reference",
    "snips.formFieldOther": "Other",
    "snips.writeForm": "Write form fields",
    "snips.writeFormTooltip":
      "Write Label | Value from the selected cell as the top-left origin",
    "snips.formMixedDocuments":
      "Tagged fields must come from the same document.",
    "snips.formEmptyTags":
      "Tag a word or line as a form field before writing to Excel.",
    "templates.kicker": "Templates",
    "templates.title": "Workbook and team-shared setups",
    "templates.desc":
      "Replicate matching logic across workbooks and team audit projects.",
    "templates.setups": "setups",
    "templates.nameLabel": "Template Name",
    "templates.placeholder": "e.g. Expense testing baseline",
    "templates.saving": "Saving...",
    "templates.save": "Save Template",
    "templates.export": "Export JSON",
    "templates.importLabel": "Import Configuration",
    "templates.savedLibrary": "Saved Library",
    "templates.deleteTooltip": "Delete template",
    "templates.tol": "Tol. ±",
    "templates.window": "d Window",
    "templates.fields": "Fields",
    "templates.apply": "Apply Setup",
    "templates.emptyTitle": "No templates yet",
    "templates.emptyDesc":
      "Save your current column mapping and thresholds to reuse them across different workbooks.",
    "eng.planningScope": "Planning & Scope",
    "eng.selectEngagementPrompt":
      "Please select or create an engagement from the left panel to view the dashboard.",
    "eng.deleteTitle": "Delete Engagement?",
    "eng.deleteDesc":
      'Are you sure you want to delete "{name}"? This action cannot be undone.',
    "eng.deleteBtn": "Delete",
    "eng.cancelBtn": "Cancel",
    "eng.listTitle": "Engagements",
    "eng.fw.isa": "ISA",
    "eng.fw.ias_ifrs": "IAS / IFRS",
    "eng.fw.ifrs_smes": "IFRS for SMEs",
    "eng.status.notStarted": "Not Started",
    "eng.status.inProgress": "In Progress",
    "eng.status.pendingClient": "Pending Client",
    "eng.status.underReview": "Under Review",
    "eng.status.clearedPartner": "Cleared for Partner Review",
    "eng.status.archived": "Archived",
    "eng.status.completed": "Completed",
    "app.prev": "Prev",
    "app.next": "Next",
    "viewer.liveInspection": "Live Inspection",
    "viewer.renderingPdf": "Rendering PDF...",
    "viewer.busySkeletonAria": "Rendering PDF",
    "viewer.detectedMetadata": "Detected Metadata",
    "viewer.invoiceNum": "Invoice",
    "viewer.amountVal": "Amount",
    "viewer.dateVal": "Date",
    "viewer.statementEntries": "statement entries",
    "viewer.relevantSnippets": "Relevant Snippets",
    "viewer.captureSnippet": "Capture this extracted snippet",
    "viewer.snipBtn": "Snip",
    "eng.clientRequired": "Client name is required",
    "eng.createdSuccess": "New engagement created successfully",
    "eng.deletedSuccess": "Engagement deleted successfully",
    "eng.responded": "Responded",
    "eng.closed": "Closed",
    "eng.pbc.uploaded": "Uploaded (Needs Review)",
    "eng.pbc.approved": "Approved evidence",
    "eng.currency": "Currency",
    "eng.currencyOther": "Other (ISO)",
    "eng.currencyInvalid":
      "Enter a valid 3-letter ISO 4217 code (for example MMK).",
    "eng.ocrLanguage": "OCR language",
    "eng.ocrMyanmarEnglish": "Myanmar + English",
    "eng.ocrEnglish": "English",
    "eng.reportingSaveFailed":
      "Reporting settings could not be saved to the workbook.",
    "snip.undo": "Undo",
    "snip.undone": "Snip restored",
    "snip.undoExpired": "Undo is no longer available.",
    "snip.tableLinked": "Table written to Excel",
    "snip.tableReplaced": "Table replaced existing cells",
    "snip.formLinked": "Form fields written to Excel",
    "snip.formReplaced": "Form fields replaced existing cells",
    "snip.tableDetectFailed":
      "Could not split that selection into a table. Drag again or click a word or line.",
    "snip.noTextLayer": "This page has no selectable text.",
    "snip.mergedDestination":
      "Cannot write a table onto a merged cell. Select a single unmerged cell.",
    "snip.undoSessionWeak":
      "Cell content was restored. Workbook click-back was not kept for this session.",
    "viewer.fieldLocationUnavailable":
      "Matched fields could not be located on this page text layer.",
    "persist.sessionCacheFailedTitle": "Session cache failed",
    "persist.sessionCacheFailedDesc":
      "The file is in this workbook. IndexedDB could not cache it for this session.",
    "persist.evidenceOpenFailedTitle": "Evidence could not be opened",
    "persist.evidenceOpenFailedDesc":
      "The linked file is not in this workbook.",
    "persist.evidenceNotStoredTitle": "Evidence was not stored",
    "persist.evidenceNotStoredWorkbookDesc":
      "The file could not be saved to the workbook or the session cache.",
    "persist.evidenceNotStoredIdbDesc":
      "IndexedDB could not save this file. It remains available in this session only.",
    "persist.workbookEmbedFailedTitle": "Workbook embed failed",
    "persist.workbookEmbedFailedDesc":
      "Evidence was kept in IndexedDB for this session.",
    "persist.templatesLoadFailedTitle": "Templates could not be loaded",
    "persist.templatesLoadFailedFallback":
      "Workbook templates are unavailable.",
    "persist.auditLogLoadFailedTitle": "Audit log could not be loaded",
    "persist.auditLogLoadFailedFallback":
      "The hidden ISA log sheet could not be read.",
    "persist.fileTooLargeTitle": "{name} was not stored",
    "persist.fileTooLargeDesc":
      "The file is over 20 MB after processing and exceeds the workbook safety limit.",
    "persist.workbookEmbedUnavailableTitle": "Workbook embed unavailable",
    "persist.workbookEmbedUnavailableDesc":
      "This Excel host does not support Custom XML parts. Evidence stays in this session via IndexedDB.",
    "persist.workbookEvidenceRemoveFailedTitle":
      "Workbook evidence could not be removed",
    "persist.workbookEvidenceRemoveFailedFallback":
      "The document was removed from this session.",
    "persist.evidenceFileMissingTitle": "Evidence file is missing",
    "persist.evidenceFileMissingDesc":
      "Parse text was restored but the PDF or image bytes are not in IndexedDB.",
    "persist.parseCacheMissingTitle": "Parse cache missing",
    "persist.parseCacheMissingDesc":
      "Document files may still preview. Matching text was not in IndexedDB and was not re-run.",
    "persist.workbookEvidenceReadFailedTitle":
      "Workbook evidence could not be read",
    "persist.workbookEvidenceReadFailedFallback":
      "Falling back to IndexedDB for this session.",
    "persist.snipAnchorsRestoreFailedTitle":
      "Snip anchors could not be restored",
    "persist.snipAnchorsRestoreFailedFallback":
      "Linked cells in this workbook could not be read.",
    "persist.evidenceCacheSaveFailedTitle": "Evidence cache could not be saved",
    "persist.evidenceCacheSaveFailedDesc":
      "Parse text could not be stored in IndexedDB. This session still has the documents.",
    "persist.engagementSaveFailedTitle": "Engagement save failed",
    "persist.engagementSaveFailedDesc":
      "Browser storage is full or blocked. Evidence bytes stay in IndexedDB when they were saved.",
    "match.sampleRequiredTitle": "Sample selection required",
    "match.sampleRequiredMappingDesc":
      "Capture an Excel range first so DocTrace can suggest the input columns.",
    "match.sampleRequiredTbDesc":
      "Tick at least one listing row before sending to Matching.",
    "match.mappingAppliedTitle": "Suggested mapping applied",
    "match.mappingAppliedDesc":
      "Input roles and output columns were refreshed from the captured sample.",
    "match.excelContextTitle": "Excel context required",
    "match.excelContextCaptureDesc":
      "Open DocTrace inside Excel to capture a workbook selection.",
    "match.selectionCapturedTitle": "Selection captured",
    "match.selectionCapturedDesc":
      "{count} sample rows are ready for matching.",
    "match.selectionFailedTitle": "Selection capture failed",
    "match.selectionFailedFallback": "Excel selection could not be read.",
    "match.tbSampleReadyTitle": "TB sample ready",
    "match.tbSampleReadyDesc":
      "{count} listing row(s) are ready in Matching Step 1.",
    "match.noSampleTitle": "No sample selected",
    "match.noSampleDocsDesc":
      "Capture the Excel sample range before matching documents.",
    "match.noSampleDesc": "Capture the Excel sample range before matching.",
    "match.noEvidenceTitle": "No evidence imported",
    "match.noEvidenceRunDesc":
      "Import invoices and bank statements before running a match.",
    "match.noEvidenceDesc":
      "Import invoices and bank statements before matching.",
    "match.noOutputTitle": "No output fields selected",
    "match.noOutputDesc": "Choose at least one output field before matching.",
    "match.outputIncompleteTitle": "Output mapping incomplete",
    "match.outputIncompleteBeforeDesc":
      "Every enabled output field needs a target Excel column before matching.",
    "match.outputIncompleteDesc":
      "Every enabled output field needs a target Excel column.",
    "match.outputDuplicateTitle": "Output columns are duplicated",
    "match.outputDuplicateDesc":
      "Each enabled output field must write to a different Excel column.",
    "match.completedTitle": "Matching completed",
    "match.completedDesc":
      "{count} sample row(s) were processed and written back to Excel.",
    "match.failedTitle": "Matching failed",
    "match.failedFallback": "The matching run did not complete.",
    "match.rowNotFoundTitle": "Row not found",
    "match.rowNotFoundDesc":
      "Row {row} is outside the captured selection range.",
    "match.rowMatchedTitle": "Row {row} matched",
    "match.rowMatchedDesc":
      "Row {row} matched successfully ({confidence}% confidence).",
    "match.rowFailedTitle": "Row {row} match failed",
    "match.excelConnectionTitle": "Excel connection required",
    "match.excelConnectionDesc":
      "Active row matching is only available inside Excel.",
    "match.outOfBoundsTitle": "Selection out of bounds",
    "match.outOfBoundsDesc":
      "Place your Excel cursor inside the captured range (Rows {min} - {max}).",
    "match.activeRowFailedTitle": "Could not match active row",
    "match.activeRowFailedFallback": "Failed to resolve Excel cursor row.",
    "match.clearedTitle": "Match cleared",
    "match.clearedExcelDesc": "Match results were cleared from Excel and UI.",
    "match.clearedUiDesc": "Match results were cleared from UI.",
    "match.clearFailedTitle": "Clear failed",
    "match.clearFailedFallback": "Unable to clear Excel range.",
    "wp.sendBlockedTitle": "Workpaper send blocked",
    "wp.sendBlockedDesc": "This engagement is locked.",
    "wp.matchRequiredTitle": "Match results required",
    "wp.matchRequiredDesc":
      "Run matching before sending a ToD pack to Workpapers.",
    "wp.packReadyTitle": "ToD pack ready",
    "wp.packReadyDesc": "{count} row(s) are in the Workpapers index.",
    "wp.signBlockedTitle": "Workpaper sign-off blocked",
    "wp.signBlockedLockedDesc": "This engagement is locked.",
    "wp.signBlockedReviewDesc":
      "Sign exception and partial rows in Matching Review first, and enter preparer and reviewer initials.",
    "wp.signedTitle": "Workpaper signed",
    "wp.signedDesc": "{preparer} / {reviewer} signed the ToD pack.",
    "results.signOffExceptionOnly":
      "Only unmatched exception rows can be signed off.",
    "results.signOffLogFailedTitle": "Sign-off could not be logged",
    "results.signOffLogFailedFallback":
      "The hidden ISA log sheet could not be updated.",
    "template.savedTitle": "Template saved",
    "template.savedDesc": "{name} is available for this workbook.",
    "template.appliedTitle": "Template applied",
    "template.appliedDesc": "{name} is now active.",
    "template.deletedTitle": "Template deleted",
    "template.deletedFallback": "The template was removed.",
    "template.exportedTitle": "Templates exported",
    "template.exportedDesc":
      "The workbook template bundle was downloaded as JSON.",
    "template.importedTitle": "Templates imported",
    "template.importedDesc": "{count} template(s) are now available.",
    "template.importFailedTitle": "Template import failed",
    "template.importFailedFallback":
      "The selected template file could not be read.",
    "snip.emptyIgnoredTitle": "Empty snip ignored",
    "snip.emptyIgnoredDesc":
      "Choose a text value or evidence region with content.",
    "snip.alreadyCapturedTitle": "Snip already captured",
    "snip.alreadyCapturedDesc": '"{text}" is already in the snip list.',
    "snip.addFailedTitle": "Add snip failed",
    "snip.undoFailedTitle": "Snip undo failed",
    "snip.undoFailedFallback": "The previous snip could not be restored.",
    "snip.excelContextLinkDesc":
      "Open DocTrace inside Excel to link snips to cells.",
    "snip.linkFailedTitle": "Snip link failed",
    "snip.linkFailedNoDocument":
      "The source document is no longer in this session.",
    "snip.linkFailedFallback": "Could not write to the selected cell.",
    "snip.formWriteFailedTitle": "Form write failed",
    "snip.formWriteFailedFallback":
      "The tagged fields could not be written to Excel.",
    "snip.replacedTitle": "Snip replaced on cell",
    "snip.linkedTitle": "Snip linked",
    "snip.linkedSessionTitle": "Snip linked in this session",
    "snip.replacedDesc": '"{text}" replaced the previous snip on {cell}.',
    "snip.linkedDesc": '"{text}" -> {cell}',
    "snip.hostNoBindingsCells":
      "This Excel host cannot store snip bindings. The cells were filled for this session only.",
    "snip.hostNoBindingsCell":
      "This Excel host cannot store snip bindings. The cell was filled for this session only.",
    "snip.hashMissingAnchor":
      "The evidence file hash is missing, so a reopen-safe anchor was not stored.",
    "snip.hostTopLeftOnly":
      "This Excel host bound only the top-left cell. Other table cells may not reopen the PDF.",
    "snip.sessionKeepCellsFallback":
      "The cells were filled for this session. The workbook did not keep the snip location.",
    "snip.sessionKeepCellFallback":
      "The cell was filled for this session. The workbook did not keep the snip location.",
    "app.runtimeError": "Runtime error",
    "app.unhandledRejection": "Unhandled promise rejection",
    "identity.readFailedFallback": "Workbook initials could not be read.",
    "identity.saveFailedFallback": "Workbook initials could not be saved.",
    "eng.reportingReadFailedFallback": "Workbook reporting could not be read.",
    "eng.reportingSaveFailedFallback": "Workbook reporting could not be saved.",
    "activity.sessionCacheFailedDesc":
      "Workbook embed succeeded; IndexedDB cache failed.",
    "activity.evidenceNotStoredBothDesc":
      "Workbook embed and IndexedDB both failed.",
    "activity.evidenceNotStoredIdbDesc": "IndexedDB blob persist failed.",
    "activity.templatesLoadedTitle": "Workbook templates loaded",
    "activity.templatesLoadedDesc":
      "{count} template(s) available in this workbook.",
    "activity.templatesFailedTitle": "Workbook templates failed",
    "activity.mappingBlockedTitle": "Suggested mapping blocked",
    "activity.mappingBlockedDesc": "No Excel sample is active yet.",
    "activity.mappingAppliedDesc": "Mapped {count} captured column(s).",
    "activity.selectionBlockedTitle": "Selection capture blocked",
    "activity.selectionBlockedDesc":
      "The add-in is not connected to an Excel host.",
    "activity.capturingSelectionTitle": "Capturing Excel selection",
    "activity.selectionCapturedDesc": "{address} is ready for mapping.",
    "activity.selectionCapturedEmptyTitle":
      "Selection captured without sample rows",
    "activity.selectionCapturedEmptyDesc":
      "Select at least one data row below the header row and capture again.",
    "activity.tbBlockedTitle": "TB sample blocked",
    "activity.tbBlockedDesc": "No listing rows were ticked.",
    "activity.tbSentTitle": "TB sample sent to Matching",
    "activity.tbSentDesc": "{count} row(s) from {sheet}.",
    "activity.todBlockedTitle": "ToD workpaper blocked",
    "activity.todBlockedLockedDesc": "Engagement is locked.",
    "activity.todBlockedNoResultsDesc": "No match results to assemble.",
    "activity.todSentTitle": "ToD sent to Workpapers",
    "activity.todSentDesc": "{count} row(s), {snips} snip(s).",
    "activity.signBlockedLockedDesc": "Engagement is locked.",
    "activity.signBlockedUnsignedDesc":
      "Unsigned exceptions or incomplete identity.",
    "activity.workpaperFileSignedTitle": "Workpaper file signed",
    "activity.identityPairDesc": "{preparer} / {reviewer}.",
    "activity.fileTooLargeDesc":
      "Evidence exceeded the 20 MB workbook safety limit.",
    "activity.invoicePickerDismissed": "Invoice picker dismissed",
    "activity.bankPickerDismissed": "Bank picker dismissed",
    "activity.evidenceRemovedTitle": "Evidence removed",
    "activity.matchBlockedTitle": "Matching blocked",
    "activity.matchBlockedNoSampleDesc":
      "No Excel sample has been captured yet.",
    "activity.matchBlockedNoEvidenceDesc":
      "No evidence documents are loaded yet.",
    "activity.matchBlockedNoOutputDesc": "No output fields are enabled.",
    "activity.matchBlockedIncompleteDesc":
      "Some enabled output fields do not have target Excel columns yet.",
    "activity.matchBlockedDuplicateDesc":
      "Duplicate Excel output columns were detected.",
    "activity.matchingRunningTitle": "Running deterministic matching",
    "activity.matchingRunningDesc":
      "{rows} sample row(s) and {docs} document(s).",
    "activity.workerFallbackTitle": "Matching worker fallback",
    "activity.matchingCompletedDesc":
      "{count} row(s) processed with {matched} full match(es).",
    "activity.singleRowRunningTitle": "Running single-row match",
    "activity.singleRowRunningDesc": "Row {row} from {sheet}.",
    "activity.rowMatchedDesc": "Status: {status}, Confidence: {confidence}%.",
    "activity.matchClearedDesc": "Match results cleared from Excel and UI.",
    "activity.signOffRowDesc": "Row {row}: {action}",
    "activity.templatesImportedDesc": "{count} template(s) loaded from {name}.",
    "activity.viewerFocusedTitle": "Viewer focused",
    "activity.viewerFocusedFallback": "Evidence preview updated.",
    "activity.duplicateSnipTitle": "Duplicate snip focused",
    "activity.duplicateSnipDesc": '"{text}" was already captured.',
    "activity.textSnippedTitle": "Text snipped",
    "activity.textSnippedDesc": '"{text}" from {name}',
    "activity.ocrActiveTitle": "Text extraction active",
    "activity.ocrActiveDesc": "Running OCR on image region...",
    "activity.ocrExtractedTitle": "Text extracted from region",
    "activity.ocrExtractedDesc": '"{text}" replaced coordinate placeholder.',
    "activity.ocrFailedTitle": "Text extraction failed",
    "activity.ocrFailedDesc":
      "Could not extract text from the selected region.",
    "activity.snipUndoneTitle": "Snip undone",
    "activity.tableSnipLinkedTitle": "Table snip linked to cells",
    "activity.formFieldsWrittenTitle": "Form fields written to cells",
    "activity.snipReplacedTitle": "Snip replaced on cell",
    "activity.snipLinkedToCellTitle": "Snip linked to cell",
    "activity.snipModeOnTitle": "Snip mode enabled",
    "activity.snipModeOffTitle": "Snip mode disabled",
    "activity.snipModeOnDesc":
      "Click PDF text, image regions, or viewer snippets to capture evidence.",
    "activity.snipModeOffDesc":
      "Captured snips remain available in the snip review panel.",
    "activity.snipFocusedTitle": "Snip focused",
    "activity.snipFocusedDesc": "{name} page {page}",
    "activity.snipRemovedTitle": "Snip removed",
    "activity.snipLinkRemovedTitle": "Snip link removed",
    "activity.sessionRestoredTitle": "Session restored",
    "activity.sessionRestoredDesc":
      "Previous browser session data was loaded from IndexedDB.",
    "app.officeBootstrapFallback": "Office bootstrap fallback",
    "app.officeReadyFailedFallback": "Office readiness detection failed.",
  },
};

export function translate(locale: AppLocale, key: TranslationKey) {
  return translations[locale][key] ?? translations["en-US"][key] ?? key;
}
