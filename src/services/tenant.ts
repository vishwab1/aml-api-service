import { Tenant } from '../models/tenant';
import { Optional } from 'sequelize';
import { UpdateTenant } from '../types/tenantModel';
import _ from 'lodash';
import { Status } from '../enums/status';

//create service for tenant
export const createTenant = async (req: Optional<any, string> | undefined): Promise<any> => {
  const insertTenant = await Tenant.create(req);
  const { dataValues } = insertTenant;
  return { dataValues };
};

//update single tenant
export const updateTenant = async (identifier: string, req: UpdateTenant): Promise<any> => {
  const whereClause: Record<string, any> = { identifier, is_active: true, status: Status.LIVE };
  const updateTenant = await Tenant.update(req, { where: whereClause });
  return { updateTenant };
};

//get tenant
export const getTenant = async (tenant_id: string): Promise<any> => {
  const tenant = await Tenant.findOne({
    where: { identifier: tenant_id, is_active: true, status: Status.LIVE },
    attributes: { exclude: ['id'] },
  });

  return { tenant };
};

//filter tenants
export const getTenantSearch = async (req: Record<string, any>) => {
  const limit: any = _.get(req, 'limit');
  const offset: any = _.get(req, 'offset');
  const { filters = {} } = req || {};
  const tenants = await Tenant.findAll({ limit: limit || 100, offset: offset || 0, ...(filters && { where: filters }) });
  return tenants;
};
