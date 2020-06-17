import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import {
  AnimationController,
  Animation,
  IonCard,
  IonButton,
  IonCardTitle,
  IonCardContent,
} from "@ionic/angular";

@Component({
  selector: "app-card-transition",
  templateUrl: "./app-card-transition.component.html",
  styleUrls: ["./app-card-transition.component.scss"],
})
export class AppCardTransitionComponent implements AfterViewInit {
  private state: "initial" | "transitioning" | "expanded" = "initial";
  public toggleTitleAnimation: Animation;
  public visibleWhenOpenAnimations: Animation;

  @ViewChild(IonCard, { read: ElementRef }) card: ElementRef;
  @ViewChild(IonCardTitle, { read: ElementRef }) titleElement: ElementRef;
  @ViewChild(IonButton, { read: ElementRef }) closeElement: ElementRef;
  @ViewChild(IonCardContent, { read: ElementRef }) contentElement: ElementRef;

  constructor(
    private animationCtrl: AnimationController,
    private hostElement: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.toggleTitleAnimation = this.animationCtrl
      .create()
      .addElement(this.titleElement.nativeElement)
      .duration(200)
      .fill("forwards")
      .easing("ease-in-out")
      .fromTo("opacity", "1", "0")
      .fromTo("transform", "translateX(0)", "translateX(-10px)");

    this.visibleWhenOpenAnimations = this.animationCtrl
      .create()
      .duration(200)
      .fill("forwards")
      .easing("ease-in-out");

    const toggleContentAnimation = this.animationCtrl
      .create()
      .addElement(this.contentElement.nativeElement)
      .fromTo("opacity", "0", "1")
      .fromTo("transform", "translateX(10px)", "translateX(0)");

    const toggleCloseAnimation = this.animationCtrl
      .create()
      .addElement(this.closeElement.nativeElement)
      .fromTo("opacity", "0", "0.8")
      .fromTo("transform", "translateX(10px)", "translateX(0)");

    this.visibleWhenOpenAnimations.addAnimation([toggleContentAnimation, toggleCloseAnimation]);
  }

  toggleCard() {
    if (this.state === "initial") {
      this.open();
    }

    if (this.state === "expanded") {
      this.close();
    }
  }

  async open() {
    this.state = "transitioning";
    this.toggleTitleAnimation.direction("normal");

    await this.toggleTitleAnimation.play();
    await this.expandCard();
    return (this.state = "expanded");
  }

  async close() {
    this.state = "transitioning";
    this.toggleTitleAnimation.direction("normal");
    this.visibleWhenOpenAnimations.direction("reverse");

    await Promise.all([this.toggleTitleAnimation.play(), this.visibleWhenOpenAnimations.play()]);
    await this.shrinkCard();

    return (this.state = "initial");
  }

  async expandCard() {
    // Get initial position
    const first = this.card.nativeElement.getBoundingClientRect();

    // Apply class to expand to final position
    this.renderer.addClass(this.card.nativeElement, "expanded-card");

    // Get final position
    const last = this.card.nativeElement.getBoundingClientRect();

    const invert = {
      x: first.left - last.left,
      y: first.top - last.top,
      scaleX: first.width / last.width,
      scaleY: first.height / last.height,
    };

    // Start from inverted position and transform to final position
    const expandAnimation: Animation = this.animationCtrl
      .create()
      .addElement(this.card.nativeElement)
      .duration(300)
      .beforeStyles({
        ["transform-origin"]: "0 0",
      })
      .afterStyles({
        ["overflow"]: "scroll",
      })
      .beforeAddWrite(() => {
        this.renderer.setStyle(this.hostElement.nativeElement, "z-index", "2");
      })
      .easing("ease-in-out")
      .fromTo(
        "transform",
        `translate(${invert.x}px, ${invert.y}px) scale(${invert.scaleX}, ${invert.scaleY})`,
        `translateY(0) scale(1, 1)`
      );

    expandAnimation.onFinish(() => {
      this.toggleTitleAnimation.direction("reverse");
      this.visibleWhenOpenAnimations.direction("normal");
      this.toggleTitleAnimation.play();
      this.visibleWhenOpenAnimations.play();
    });

    await expandAnimation.play();
  }

  async shrinkCard() {
    // Get initial position
    const first = this.card.nativeElement.getBoundingClientRect();

    // Reset styles
    this.renderer.removeClass(this.card.nativeElement, "expanded-card");

    // Get final position
    const last = this.card.nativeElement.getBoundingClientRect();

    const invert = {
      x: first.left - last.left,
      y: first.top - last.top,
      scaleX: first.width / last.width,
      scaleY: first.height / last.height,
    };

    const shrinkAnimation: Animation = this.animationCtrl
      .create()
      .addElement(this.card.nativeElement)
      .duration(300)
      .beforeClearStyles(["overflow"])
      .afterAddWrite(() => {
        this.renderer.setStyle(this.hostElement.nativeElement, "z-index", "1");
      })
      .easing("ease-in-out")
      .fromTo(
        "transform",
        `translate(${invert.x}px, ${invert.y}px) scale(${invert.scaleX}, ${invert.scaleY})`,
        `translateY(0) scale(1, 1)`
      );

    shrinkAnimation.onFinish(() => {
      this.toggleTitleAnimation.direction("reverse");
      this.toggleTitleAnimation.play();
    });

    await shrinkAnimation.play();
  }
}
