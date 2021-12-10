import { Component, OnInit } from '@angular/core';

import { StorageService } from './services/storage.service';
import { SubirImagen } from '../../../models/interface';
import { UxService } from 'src/app/service/ux.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  nombreUsuario
  archivo: any
  imagenUrl: any
  cancelar = false

  albumes: string[] = ['Deporte', 'Familia', 'Escuela', 'Amigos'];
  nuevaFoto: SubirImagen = {
    url: '',
    nombre: '',
    descripcion: '',
    album: '',
    visibilidad: ''
  }

  constructor(private storage: StorageService,
              private uxService: UxService,
              private data_base: DataService) {
              this.nombreUsuario = localStorage.getItem('usuario')
  }

  ngOnInit(): void {
  }

  async cargarImagen(event: any) {
    this.cancelar = false
    this.archivo = event.target.files;
    if (this.archivo) {
      this.nuevaFoto.nombre = this.archivo[0].name;
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagenUrl = event.target.result;
      }
      reader.readAsDataURL(this.archivo[0]);
    } else {
      this.uxService.Toasterror('Selecciona una imagen 😑', 2000);
    }
  }

  publicar(descripcion: string, album: string, visibilidad: string) {
    if (this.cancelar) {
      this.uxService.Toasterror('Selecciona una imagen 😑', 2000);
    } else {
      try {
        let reader = new FileReader();
        this.nuevaFoto.nombre = this.archivo[0].name;
        
        reader.readAsDataURL(this.archivo[0])
        reader.onloadend = async () => {
          this.uxService.Loading('Publicando');
          await this.storage.subirImagen(`${this.nombreUsuario}/${new Date().getTime()}`, reader.result)
          .then(urlImagen => {
              this.nuevaFoto.url = urlImagen || undefined;
              this.nuevaFoto.descripcion = descripcion
              this.nuevaFoto.album = album
              this.nuevaFoto.visibilidad = visibilidad
              this.data_base.guardarPublicacion(this.nuevaFoto)
              this.archivo = undefined
              this.uxService.finishLoading();
              this.uxService.Toast('Se a subido correctamente! 😄', 2000);
            }).catch(() => {
              this.uxService.Toasterror('Algo salio mal 😯', 2000);
            }).finally(() => {
              this.imagenUrl = undefined
              this.nuevaFoto = {
                url: '',
                nombre: '',
                descripcion: '',
                album: '',
                visibilidad: ''
              }
            });
        }
      } catch (error) {
        this.uxService.Toasterror('Selecciona una imagen 😑', 2000);
      }
    }
  }

  cambairImagen() {
    this.imagenUrl = undefined
    this.nuevaFoto.nombre = ''
    this.nuevaFoto.descripcion = ''

    this.cancelar = true
  }

  borrar(idDocument: string, urlImagen: string) {
    this.uxService.Loading('Borrando 👀');
    this.data_base.borrarPublicacion(idDocument, urlImagen)
      .then(() => {
        this.uxService.finishLoading()
        this.uxService.Toast('Se borro correctamente', 2000)
      }).catch(() => {
        this.uxService.finishLoading()
        this.uxService.Toasterror('No se pudo borrar', 2000)
      })
  }
}
