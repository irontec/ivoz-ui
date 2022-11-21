interface buildLinkProps {
  link: string;
  id?: string;
  params: Record<string, unknown>;
}

const buildLink = (props: buildLinkProps): string => {
  let { link, params, id } = props;

  for (const idx in params) {
    link = link.replace(`:${idx}`, params[idx] as string);
  }

  const urlParamNum = Object.values(params).length;
  if (id) {
    link = link.replace(`:parent_id_${urlParamNum + 1}`, id);
  }

  return link;
};

export default buildLink;
