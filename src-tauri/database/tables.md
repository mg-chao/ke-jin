### 文件说明

文件包含程序使用 SQLite 所用用到的所有表。

### 注意事项

所有时间统一用时间戳表示，类型采用 INTEGER。

### 表

#### events 表

``` sql
CREATE TABLE IF NOT EXISTS events (
    -- 事件 id
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    -- 事件标题
    title VARCHAR (128) NOT NULL DEFAULT (''),
    -- 事件备注
    comment VARCHAR (256),
    -- 是否完成事件
    complete BOOLEAN NOT NULL DEFAULT (false),
    -- 截止时间
    due_ts INTEGER,
    -- 提醒时间处理器
    reminder TEXT,
    -- 自定义数据
    custom_data TEXT,
    -- 数据渲染器
    render TEXT,
    -- 更新时间
    update_ts INTEGER DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    -- 创建时间
    create_ts INTEGER DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
```