import { Application } from '@framework/application';
import { CodeSnippetsService } from './background-services/code-snippets.service';
import { ExecutionService } from './background-services/execution.service';
import { RoutingService } from './background-services/routing.service';
import { StateService } from './background-services/state.service';
import { TitleService } from './background-services/title.service';
import { UrlService } from './background-services/url.service';
import { WindowResizingService } from './background-services/window-resizing.service';
import { RouteAnalysisComponent } from './components/routes/route-analysis/component';
import { RouteCodeComponent } from './components/routes/route-code/component';
import { CodeEditorTabsItemComponent } from './components/widgets/code-editor-tabs-item/component';
import { CodeEditorTabsComponent } from './components/widgets/code-editor-tabs/component';
import { CurrentRouteComponent } from './components/widgets/current-route/component';
import { FooterComponent } from './components/widgets/footer/component';
import { HeaderComponent } from './components/widgets/header/component';
import { IconComponent } from './components/widgets/icon/component';
import { PipelineTileComponent } from './components/widgets/pipeline-tile/component';
import { PipelineComponent } from './components/widgets/pipeline/component';
import globalStyles from './index.scss';

new Application()
  .applyGlobalStyles(globalStyles)
  .bootstrapBackgroundServices([
    CodeSnippetsService,
    TitleService,
    UrlService,
    RoutingService,
    ExecutionService,
    WindowResizingService,
    StateService
  ])
  .registerComponents([
    IconComponent,
    HeaderComponent,
    FooterComponent,
    PipelineTileComponent,
    PipelineComponent,
    CurrentRouteComponent,
    CodeEditorTabsComponent,
    CodeEditorTabsItemComponent,
    RouteCodeComponent,
    // RouteConfigurationComponent,
    RouteAnalysisComponent
  ]);
