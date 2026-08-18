import { neon } from '@neondatabase/serverless';

function sqlClient(){
  const url=process.env.DATABASE_URL;
  if(!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

export type CatalogProduct={
  id:number;
  cj_product_id:string;
  name:string;
  image_url:string|null;
  cj_cost:number;
  sale_price:number;
  status:'DRAFT'|'ACTIVE'|'ARCHIVED';
  created_at:string;
  updated_at:string;
};

export async function ensureCatalog(){
  const sql=sqlClient();
  await sql`CREATE TABLE IF NOT EXISTS catalog_products (
    id BIGSERIAL PRIMARY KEY,
    cj_product_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    image_url TEXT,
    cj_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    sale_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','ACTIVE','ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}

export async function saveDraft(input:{cjProductId:string;name:string;imageUrl?:string;cost:number;price:number}){
  await ensureCatalog();
  const sql=sqlClient();
  const rows=await sql`INSERT INTO catalog_products (cj_product_id,name,image_url,cj_cost,sale_price,status)
    VALUES (${input.cjProductId},${input.name},${input.imageUrl||null},${input.cost},${input.price},'DRAFT')
    ON CONFLICT (cj_product_id) DO UPDATE SET
      name=EXCLUDED.name,
      image_url=EXCLUDED.image_url,
      cj_cost=EXCLUDED.cj_cost,
      sale_price=EXCLUDED.sale_price,
      updated_at=NOW()
    RETURNING *`;
  return rows[0] as CatalogProduct;
}

export async function listCatalog(){
  await ensureCatalog();
  const sql=sqlClient();
  const rows=await sql`SELECT * FROM catalog_products ORDER BY created_at DESC`;
  return rows as CatalogProduct[];
}

export async function listActiveCatalog(){
  await ensureCatalog();
  const sql=sqlClient();
  const rows=await sql`SELECT * FROM catalog_products WHERE status='ACTIVE' ORDER BY updated_at DESC`;
  return rows as CatalogProduct[];
}

export async function updateCatalogProduct(id:number,input:{salePrice:number;status:'DRAFT'|'ACTIVE'|'ARCHIVED'}){
  await ensureCatalog();
  const sql=sqlClient();
  const rows=await sql`UPDATE catalog_products SET sale_price=${input.salePrice},status=${input.status},updated_at=NOW() WHERE id=${id} RETURNING *`;
  return rows[0] as CatalogProduct|undefined;
}
