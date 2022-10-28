import ScriptLoader from './utils/scriptLoader';

const loadPanel = new Promise<any>((resolve, reject) => {
    ExecuteOrDelayUntilScriptLoaded(async () => {
        try {
            const Plumsail = await ScriptLoader.loadScript(process.env.SPFormPanelUrl, {
                globalExportsName: 'Plumsail'
            });

            const panel = new Plumsail.SPFormPanel({
                webUrl: _spPageContextInfo.webServerRelativeUrl,
                listId: _spPageContextInfo.listId,
                listUrl: _spPageContextInfo.listUrl.substring(_spPageContextInfo.webServerRelativeUrl.length),
                language: _spPageContextInfo.currentUICultureName,
                culture: _spPageContextInfo.currentCultureName,
                componentLoader: ScriptLoader
            });

            resolve(panel);
        } catch (e) {
            reject(e);
        }
    }, 'core.js');
});

window['OpenPlumsailForm'] = async (formType, itemId, contentTypeId, rootFolder, fallbackUrl) => {
    try {
        const panel = await loadPanel;

        panel.open({
            itemId,
            contentTypeId,
            formType: formType,
            rootFolder,
            spSaved: () => {
                const ctx = GetCtxFromView(_spPageContextInfo.viewId.toUpperCase());
                const evtAjax = {
                    currentCtx:  ctx,
                    csrAjaxRefresh: true
                };
                AJAXRefreshView(evtAjax, SP.UI.DialogResult.OK);
            }
        });
    } catch (e) {
        console.error(e);
        window.location.href = fallbackUrl;
    }
};

SPClientTemplates.TemplateManager.RegisterTemplateOverrides({
    Templates: {
        Fields: {
            Edit: {
                View: function (ctx) {
                    return `<a href="${ctx.editFormUrl}&amp;ID=${ctx.CurrentItem.ID}" onclick="OpenPlumsailForm('Edit', ${ctx.CurrentItem.ID}, '${ctx.CurrentItem.ContentTypeId}', '${ctx.rootFolder}', '${ctx.editFormUrl}&amp;ID=${ctx.CurrentItem.ID}');return false;" target="_self" title=""><img border="0" alt="edit" src="/_layouts/15/images/edititem.gif?rev=43" data-themekey="#"></a>`;
                }
            },
            LinkTitleNoMenu: {
                View: function (ctx) {
                    return `<a class="ms-listlink" href="${ctx.displayFormUrl}&amp;ID=${ctx.CurrentItem.ID}" onclick="OpenPlumsailForm('Display', ${ctx.CurrentItem.ID}, '${ctx.CurrentItem.ContentTypeId}', '${ctx.rootFolder}', '${ctx.editFormUrl}&amp;ID=${ctx.CurrentItem.ID}');return false;" target="_self" title="${ctx.CurrentItem.Title}">${ctx.CurrentItem.Title}</a>`;
                }
            }
        }
    }
});
