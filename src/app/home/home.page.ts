import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  public cards = [];

  constructor() {}

  ngOnInit() {
    this.cards = ["Fiction", "Biography", "Classic", "Horror", "History"];
  }
}
