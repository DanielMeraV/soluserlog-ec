import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manifiestos',
  imports: [SidebarComponent, HttpClientModule, CommonModule],
  templateUrl: './manifiestos.component.html',
  styleUrl: './manifiestos.component.css'
})
export class ManifiestosComponent implements OnInit {

  camionesFijos: any[] = [];
  camionesAdicionales: any[] = [];
  error: string | null = null;
  manifiestosPorCamion: { [key: number]: any[] } = {};

  constructor(private http: HttpClient) { } 

  async ngOnInit(): Promise<void> {
    try {
      const response: any = await this.http.get(`${API_URL}/trucks/`).toPromise();    
      
      this.camionesFijos = response.filter((camion: any) => camion.type === 'permanent');
      this.camionesAdicionales = response.filter((camion: any) => camion.type === 'additional');
      
      this.camionesFijos.forEach(camion => {
        this.getManifestos(camion.id);
      });

      this.camionesAdicionales.forEach(camion => {
        this.getManifestos(camion.id);
      });

    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar los camiones.';
      console.error('Error al obtener los camiones:', this.error);
    }
  }

  async getManifestos(camionId: number): Promise<void> {
    try {
      const response = await this.http.get<any[]>(`${API_URL}/manifestos/truck/${camionId}`).toPromise();
      if (response && response.length > 0) {
        this.manifiestosPorCamion[camionId] = response;
      } else {
        this.manifiestosPorCamion[camionId] = [{
          id: "---",
          truckId: "---",
          assignmentDate: null,
          manifestoPdf: "---",
          referralGuidePdf: "---"
        }];
      }
    } catch (error) {
      console.error("Error al obtener los manifiestos:", error);
    }
  }

  async downloadPdf(manifestoId: number, type: 'manifesto' | 'referralGuide') {
    try {
      const response = await this.http.post(`${API_URL}/pdf/generate-pdf`, {
        template: type,
        id: manifestoId
      }, { responseType: 'blob' }).toPromise();

      if (response instanceof Blob) {
        // Crear enlace temporal para descarga
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-${manifestoId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('Error al descargar el documento');
    }
  }
  

}
