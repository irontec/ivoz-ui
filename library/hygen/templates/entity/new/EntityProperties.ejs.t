---
to: src/entities/<%= Name %>/<%= Name %>Properties.ts
---
import { PropertySpec } from '@irontec-voip/ivoz-ui/services/api/ParsedApiSpecInterface';
import { EntityValue, EntityValues } from '@irontec-voip/ivoz-ui/services/entity/EntityService';

export type <%= Name %>PropertyList<T> = {
<%- h.formattedEntityProperties(h.url(), Name)%>
};

export type <%= Name %>Properties = <%= Name %>PropertyList<Partial<PropertySpec>>;
export type <%= Name %>PropertiesList = Array<<%= Name %>PropertyList<EntityValue | EntityValues>>;
