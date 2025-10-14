import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WebcamModule, WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { ProductService, ProductInput } from '../../../services/product';
import { CategoryService, Category } from '../../../services/category';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-add',
  imports: [CommonModule, FormsModule, WebcamModule],
  templateUrl: './add.html',
  styleUrl: './add.css'
})
export class Add implements OnInit {
  // Webcam properties
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = '';
  public videoOptions: MediaTrackConstraints = {};
  public errors: WebcamInitError[] = [];

  // Webcam events
  public webcamImage: WebcamImage | null = null;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  // Form properties
  product: ProductInput = {
    title: '',
    description: '',
    price: 0,
    imageUrl: '',
    userId: '',
    categoryId: ''
  };

  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';
  capturedImages: string[] = [];
  maxImages = 5;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    const user = this.authService.currentUser;
    if (user) {
      this.product.userId = user.id;
    }
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories.data;
      },
      error: (error) => {
        console.error('Erreur chargement catégories:', error);
        this.errorMessage = 'Erreur lors du chargement des catégories';
      }
    });
  }

  // Webcam methods
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    console.error('Webcam error:', error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('Received webcam image', webcamImage);
    this.webcamImage = webcamImage;

    // Convert to base64 and add to captured images
    if (this.capturedImages.length < this.maxImages) {
      this.capturedImages.push(webcamImage.imageAsDataUrl);
    }
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('Active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  // Form methods
  removeImage(index: number) {
    this.capturedImages.splice(index, 1);
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Veuillez remplir tous les champs requis et capturer au moins une photo';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Use the first captured image as the main image
    this.product.imageUrl = this.capturedImages[0];

    this.productService.createProduct(this.product).subscribe({
      next: (product) => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la création du produit';
        console.error('Erreur création produit:', error);
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.product.title.trim() &&
      this.product.price > 0 &&
      this.product.categoryId &&
      this.product.userId &&
      this.capturedImages.length > 0
    );
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}