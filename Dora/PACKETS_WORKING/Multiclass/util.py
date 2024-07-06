def get_value_by_path(obj: dict, path: str, default):
    keys = path.split('.')
    if keys[0] not in obj:
        return default
    
    if len(keys) == 1:
        return obj[keys[0]]
    
    return get_value_by_path(obj[keys[0]], '.'.join(keys[1:]), default)