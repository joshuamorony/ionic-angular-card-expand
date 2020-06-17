import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HomePage } from "./home.page";
import { AppCardTransitionComponent } from "../components/app-card-transition/app-card-transition.component";

import { HomePageRoutingModule } from "./home-routing.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, AppCardTransitionComponent],
})
export class HomePageModule {}
