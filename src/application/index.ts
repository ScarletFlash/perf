import { Application } from '@framework/application';
import { ExecutionService } from './background-services/execution.service';
import { RoutingService } from './background-services/routing.service';
import { TitleService } from './background-services/title.service';
import { UrlService } from './background-services/url.service';
import { WindowResizingService } from './background-services/window-resizing.service';
import { RouteCodeComponent } from './components/routes/route-code/component';
import { CurrentRouteComponent } from './components/widgets/current-route/component';
import { FooterComponent } from './components/widgets/footer/component';
import { HeaderComponent } from './components/widgets/header/component';
import { IconComponent } from './components/widgets/icon/component';
import { PipelineTileComponent } from './components/widgets/pipeline-tile/component';
import { PipelineComponent } from './components/widgets/pipeline/component';
import globalStyles from './index.scss';

new Application()
  .applyGlobalStyles(globalStyles)
  .bootstrapBackgroundServices([TitleService, UrlService, RoutingService, ExecutionService, WindowResizingService])
  .registerComponents([
    IconComponent,
    HeaderComponent,
    FooterComponent,
    PipelineTileComponent,
    PipelineComponent,
    CurrentRouteComponent,

    RouteCodeComponent
    // RouteConfigurationComponent,
    // RouteAnalysisComponent,
  ]);
