import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearUsuarioModule } from './administration/features/crear-usuario/crear-usuario.module';
import { CrearCamionModule } from './administration/features/crear-camion/crear-camion.module';
import { CrearClienteModule } from './administration/features/crear-cliente/crear-cliente.module';
import { AuthGuard } from './auth.guard'; 

export const routes: Routes = [
  { path: 'login', loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule) },

  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'client-map/:idCliente', canActivate: [AuthGuard], loadChildren: () => import('./features/client-map/client-map.module').then(m => m.ClientMapModule) },
  { path: 'truck-map/:idCamion', canActivate: [AuthGuard], loadChildren: () => import('./features/truck-map/truck-map.module').then(m => m.TruckMapModule) },

  { path: 'pedidos', canActivate: [AuthGuard], loadChildren: () => import('./packages/features/pedidos/pedidos.module').then(m => m.PedidosModule) },
  { path: 'crear-pedido', data: { modo: 'crear' }, canActivate: [AuthGuard], loadChildren: () => import('./packages/features/crear-pedido/crear-pedido.module').then(m => m.CrearPedidosModule) },
  { path: 'editar-pedido/:id', data: { modo: 'editar' }, canActivate: [AuthGuard], loadChildren: () => import('./packages/features/crear-pedido/crear-pedido.module').then(m => m.CrearPedidosModule) },
  { path: 'pedidos-por-despachar', canActivate: [AuthGuard], loadChildren: () => import('./packages/features/pedidos-por-despachar/pedidos-por-despachar.module').then(m => m.PedidosPorDespacharModule) },
  { path: 'manifiestos', canActivate: [AuthGuard], loadChildren: () => import('./packages/features/manifiestos/manifiestos.module').then(m => m.ManifiestosModule) },
  { path: 'crear-manifiesto', canActivate: [AuthGuard], loadChildren: () => import('./packages/features/crear-manifiesto/crear-manifiesto.module').then(m => m.CrearManifiestoModule) },

  { path: 'clientes', canActivate: [AuthGuard], loadChildren: () => import('./administration/features/clientes/clientes.module').then(m => m.ClientesModule) },
  { path: 'crear-cliente', data: { modo: 'crear' }, canActivate: [AuthGuard], loadChildren: () => import('./administration/features/crear-cliente/crear-cliente.module').then(m => CrearClienteModule) },
  { path: 'editar-cliente/:id', data: { modo: 'editar' }, canActivate: [AuthGuard], loadChildren: () => import('./administration/features/crear-cliente/crear-cliente.module').then(m => CrearClienteModule) },

  { path: 'usuarios', canActivate: [AuthGuard], loadChildren: () => import('./administration/features/usuarios/usuarios.module').then(m => m.UsuariosModule) },
  { path: 'crear-usuario', data: { modo: 'crear' }, canActivate: [AuthGuard], loadChildren: () => import('./administration/features/crear-usuario/crear-usuario.module').then(m => CrearUsuarioModule) },
  { path: 'editar-usuario/:id', data: { modo: 'editar' }, canActivate: [AuthGuard], loadChildren: () => import('./administration/features/crear-usuario/crear-usuario.module').then(m => CrearUsuarioModule) },
  
  { path: 'camiones', canActivate: [AuthGuard], loadChildren: () => import('./administration/features/camiones/camiones.module').then(m => m.CamionesModule) },
  { path: 'crear-camion', data: { modo: 'crear' }, canActivate: [AuthGuard], loadChildren: () => import('./administration/features/crear-camion/crear-camion.module').then(m => CrearCamionModule) },
  { path: 'editar-camion/:id', data: { modo: 'editar' }, canActivate: [AuthGuard], loadChildren: () => import('./administration/features/crear-camion/crear-camion.module').then(m => CrearCamionModule) },

  { path: 'envios', canActivate: [AuthGuard], loadChildren: () => import('./trucks/features/envios/envios.module').then(m => m.EnviosModule) },
  { path: 'detalles-bitacora/:idBitacora', canActivate: [AuthGuard], loadChildren: () => import('./trucks/features/detalles-bitacora/detalles-bitacora.module').then(m => m.DetallesBitacoraModule) },
  { path: 'crear-bitacora/:idManifiesto', canActivate: [AuthGuard], loadChildren: () => import('./trucks/features/crear-bitacora/crear-bitacora.module').then(m => m.CrearBitacoraModule) },
  { path: 'bitacoras', canActivate: [AuthGuard], loadChildren: () => import('./trucks/features/bitacoras/bitacoras.module').then(m => m.BitacorasModule) },


  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige al login al iniciar
  { path: '**', redirectTo: 'login' }, // Manejo de rutas no encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
