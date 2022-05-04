import { ExecutionService } from '@services/execution';
import { CurrentRouteComponent } from '@widgets/current-route';
import { FooterComponent } from '@widgets/footer';
import { HeaderComponent } from '@widgets/header';
import { IconComponent } from '@widgets/icon';
import { PipelineComponent } from '@widgets/pipeline';
import { TileComponent } from '@widgets/tile';
import { Application } from './application';

new Application()
  .applyGlobalStyles()
  .registerComponents([
    IconComponent,
    HeaderComponent,
    FooterComponent,
    TileComponent,
    PipelineComponent,
    CurrentRouteComponent

    // RouteAnalysisComponent,
    // RouteCodeComponent,
    // RouteMinificationComponent,
    // RouteTranspilationComponent
  ])
  .bootstrapBackgroundServices([ExecutionService]);
