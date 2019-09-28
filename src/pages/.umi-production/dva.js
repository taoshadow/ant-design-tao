import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'analysis_detail', ...(require('F:/java/ant-design-tao/src/models/analysis_detail.js').default) });
app.model({ namespace: 'analysis_list', ...(require('F:/java/ant-design-tao/src/models/analysis_list.js').default) });
app.model({ namespace: 'analysis_score', ...(require('F:/java/ant-design-tao/src/models/analysis_score.js').default) });
app.model({ namespace: 'analysis_xic', ...(require('F:/java/ant-design-tao/src/models/analysis_xic.js').default) });
app.model({ namespace: 'console', ...(require('F:/java/ant-design-tao/src/models/console.js').default) });
app.model({ namespace: 'irt_standard_library_detail', ...(require('F:/java/ant-design-tao/src/models/irt_standard_library_detail.js').default) });
app.model({ namespace: 'irt_standard_library_list', ...(require('F:/java/ant-design-tao/src/models/irt_standard_library_list.js').default) });
app.model({ namespace: 'irt_standard_library_update', ...(require('F:/java/ant-design-tao/src/models/irt_standard_library_update.js').default) });
app.model({ namespace: 'language', ...(require('F:/java/ant-design-tao/src/models/language.js').default) });
app.model({ namespace: 'login', ...(require('F:/java/ant-design-tao/src/models/login.js').default) });
app.model({ namespace: 'peptide_detail', ...(require('F:/java/ant-design-tao/src/models/peptide_detail.js').default) });
app.model({ namespace: 'peptide_list', ...(require('F:/java/ant-design-tao/src/models/peptide_list.js').default) });
app.model({ namespace: 'protein_list', ...(require('F:/java/ant-design-tao/src/models/protein_list.js').default) });
app.model({ namespace: 'public_irt_standard_library_detail', ...(require('F:/java/ant-design-tao/src/models/public_irt_standard_library_detail.js').default) });
app.model({ namespace: 'public_irt_standard_library_list', ...(require('F:/java/ant-design-tao/src/models/public_irt_standard_library_list.js').default) });
app.model({ namespace: 'public_irt_standard_library_update', ...(require('F:/java/ant-design-tao/src/models/public_irt_standard_library_update.js').default) });
app.model({ namespace: 'public_standard_library_detail', ...(require('F:/java/ant-design-tao/src/models/public_standard_library_detail.js').default) });
app.model({ namespace: 'public_standard_library_list', ...(require('F:/java/ant-design-tao/src/models/public_standard_library_list.js').default) });
app.model({ namespace: 'public_standard_library_update', ...(require('F:/java/ant-design-tao/src/models/public_standard_library_update.js').default) });
app.model({ namespace: 'puzzlecards', ...(require('F:/java/ant-design-tao/src/models/puzzlecards.js').default) });
app.model({ namespace: 'standard_library_create', ...(require('F:/java/ant-design-tao/src/models/standard_library_create.js').default) });
app.model({ namespace: 'standard_library_detail', ...(require('F:/java/ant-design-tao/src/models/standard_library_detail.js').default) });
app.model({ namespace: 'standard_library_list', ...(require('F:/java/ant-design-tao/src/models/standard_library_list.js').default) });
app.model({ namespace: 'standard_library_update', ...(require('F:/java/ant-design-tao/src/models/standard_library_update.js').default) });
app.model({ namespace: 'task_list', ...(require('F:/java/ant-design-tao/src/models/task_list.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
