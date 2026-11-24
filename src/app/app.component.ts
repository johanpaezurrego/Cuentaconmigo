import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type Move = { id:number; type:'Ingreso'|'Gasto'; amount:number; date:string; category:string; description:string };

@Component({selector:'app-root',standalone:true,imports:[IonicModule,FormsModule,CommonModule],templateUrl:'./app.component.html',styleUrls:['./app.component.scss']})
export class AppComponent {
  title='Cuentaconmigo';
  categories=['Alimentación','Transporte','Vivienda','Servicios','Salud','Educación','Entretenimiento','Compras personales','Salario','Otros ingresos','Otros gastos'];
  moves:Move[]=this.loadMoves(); page='Inicio'; filterType='Todos'; filterCategory='Todas'; month=new Date().toISOString().slice(0,7);
  draft:Move={id:0,type:'Gasto',amount:0,date:new Date().toISOString().slice(0,10),category:'Alimentación',description:''}; editing=false; formError='';
  private loadMoves():Move[]{try{return JSON.parse(localStorage.getItem('cc-moves')||'[]')}catch{return []}}
  get filtered(){return this.moves.filter(m=>(!this.month||m.date.startsWith(this.month))&&(this.filterType==='Todos'||m.type===this.filterType)&&(this.filterCategory==='Todas'||m.category===this.filterCategory)).sort((a,b)=>b.date.localeCompare(a.date));}
  get income(){return this.filtered.filter(m=>m.type==='Ingreso').reduce((s,m)=>s+m.amount,0)}
  get expense(){return this.filtered.filter(m=>m.type==='Gasto').reduce((s,m)=>s+m.amount,0)}
  get balance(){return this.income-this.expense}
  get byCategory(){const out:Record<string,number>={};this.filtered.filter(m=>m.type==='Gasto').forEach(m=>out[m.category]=(out[m.category]||0)+m.amount);return Object.entries(out).sort((a,b)=>b[1]-a[1]);}
  save(){this.formError='';if(!this.draft.amount||Number(this.draft.amount)<=0){this.formError='Ingresa un valor mayor que cero.';return;}if(!this.draft.date){this.formError='Selecciona una fecha.';return;}if(!this.draft.category){this.formError='Selecciona una categoría.';return;}
    const movement={...this.draft,amount:Number(this.draft.amount)};
    if(this.editing)this.moves=this.moves.map(m=>m.id===movement.id?movement:m);else this.moves=[{...movement,id:Date.now()},...this.moves];
    this.persist();this.reset();this.page='Movimientos';this.filterType='Todos';this.filterCategory='Todas';}
  startNew(type:'Ingreso'|'Gasto'='Gasto'){this.editing=false;this.formError='';this.draft={id:0,type,amount:0,date:new Date().toISOString().slice(0,10),category:type==='Ingreso'?'Salario':'Alimentación',description:''};this.page='Nuevo';}
  edit(m:Move){this.draft={...m};this.editing=true;this.formError='';this.page='Nuevo';}
  cancelForm(){this.reset();this.page='Movimientos';}
  async remove(m:Move){const a=await this.alerts.create({header:'Eliminar movimiento',message:'¿Deseas eliminar este registro?',buttons:[{text:'Cancelar',role:'cancel'},{text:'Eliminar',role:'destructive',handler:()=>{this.moves=this.moves.filter(x=>x.id!==m.id);this.persist();}}]});await a.present();}
  persist(){try{localStorage.setItem('cc-moves',JSON.stringify(this.moves))}catch{this.formError='No fue posible guardar los datos en el navegador.'}}
  reset(){this.draft={id:0,type:'Gasto',amount:0,date:new Date().toISOString().slice(0,10),category:'Alimentación',description:''};this.editing=false;this.formError='';}
  money(n:number){return n.toLocaleString('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});}
  constructor(private alerts:AlertController){}
}
