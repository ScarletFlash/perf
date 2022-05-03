import { RouteAnalysisComponent } from '@routes/route-analysis';
import { RouteCodeComponent } from '@routes/route-code';
import { RouteMinificationComponent } from '@routes/route-minification';
import { RouteTranspilationComponent } from '@routes/route-transpilation';
import { ExecutionService } from '@services/execution';
import { CurrentRouteComponent } from '@widgets/current-route';
import { FooterComponent } from '@widgets/footer';
import { HeaderComponent } from '@widgets/header';
import { PipelineComponent } from '@widgets/pipeline';
import { TileComponent } from '@widgets/tile';
import { Application } from './application';

new Application()
  .applyGlobalStyles()
  .registerComponents([
    HeaderComponent,
    FooterComponent,
    TileComponent,
    PipelineComponent,
    CurrentRouteComponent,

    RouteAnalysisComponent,
    RouteCodeComponent,
    RouteMinificationComponent,
    RouteTranspilationComponent
  ])
  .bootstrapBackgroundServices([ExecutionService]);
