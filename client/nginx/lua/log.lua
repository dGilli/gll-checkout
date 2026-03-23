local cjson = require "cjson.safe"

-- Config
local LOG_PATH   = "/mnt/storage/logs/custom_log.json"
local MAX_LINES  = 2
local TIME_FMT   = "%Y%m%d_%H%M%S"

-- Helpers
local function err_exit(...)
    ngx.log(ngx.ERR, ...)
    ngx.exit(500)
end

local function file_exists(path)
    local f = io.open(path, "r")
    if f then f:close(); return true end
    return false
end

local function count_lines(path)
    local f, ferr = io.open(path, "r")
    if not f then return nil, ferr end
    local count = 0
    for _ in f:lines() do count = count + 1 end
    f:close()
    return count
end

local function timestamp()
    return os.date(TIME_FMT, os.time())
end

local function rotate_file(path)
    local ts = timestamp()
    local newname = path:gsub("(%.[^%.]+)$", "_" .. ts .. "%1")
    if newname == path then newname = path .. "_" .. ts end

    local ok, rerr = os.rename(path, newname)
    if not ok then return nil, rerr end
    return newname
end

-- Read request body (handles large bodies stored in temp file)
ngx.req.read_body()
local body = ngx.req.get_body_data()
if not body then
    local tmp = ngx.req.get_body_file()
    if tmp then
        local fh, ferr = io.open(tmp, "rb")
        if not fh then err_exit("failed to open temp body file: ", ferr) end
        body = fh:read("*a")
        fh:close()
    end
end
body = body or ""

-- Rotate if needed
if file_exists(LOG_PATH) then
    local lines, lerr = count_lines(LOG_PATH)
    if not lines then err_exit("failed counting lines: ", lerr) end

    if lines >= MAX_LINES then
        local rotated, rerr = rotate_file(LOG_PATH)
        if not rotated then err_exit("failed rotating file: ", rerr) end
    end
end

local entry = {
    ts     = ngx.localtime(),
    remote = ngx.var.remote_addr or "-",
    method = ngx.req.get_method(),
    uri    = ngx.var.request_uri or "-",
    body   = body,
}

local json_line, jerr = cjson.encode(entry)
if not json_line then err_exit("json encode error: ", jerr) end
json_line = json_line .. "\n"

local fh, ferr = io.open(LOG_PATH, "a")
if not fh then err_exit("failed to open log file: ", ferr) end
fh:write(json_line)
fh:close()

ngx.status = 204
ngx.say("")
