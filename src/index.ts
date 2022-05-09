import { RouteCodeComponent } from '@routes/route-code';
import { ExecutionService } from '@services/execution';
import { RoutingService } from '@services/routing';
import { TitleService } from '@services/title';
import { UrlService } from '@services/url';
import { WindowResizingService } from '@services/window-resizing';
import { CurrentRouteComponent } from '@widgets/current-route';
import { FooterComponent } from '@widgets/footer';
import { HeaderComponent } from '@widgets/header';
import { IconComponent } from '@widgets/icon';
import { PipelineComponent } from '@widgets/pipeline';
import { PipelineTileComponent } from '@widgets/pipeline-tile';
import { Application } from './application';

new Application()
  .applyGlobalStyles()
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
