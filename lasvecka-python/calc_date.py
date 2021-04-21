from datetime import date, timedelta
import json

EASTER_START = "2021-04-01"
EASTER_END = "2021-04-10"
ORD_CONT = "2021-04-12"

# Find the appropiate date
def read_date_period():
    current_date = date.today()
    sought_date = ""
    diff = -1000
    with open('data.txt', 'r') as data_file:
        date_dict = eval(data_file.read())
        for dat, typ in date_dict.items():
            delta_t = date.fromisoformat(dat) - current_date
            print(delta_t.days)
            print(diff)
            if delta_t.days == 0:
                return (date.fromisoformat(dat), typ)
            elif delta_t.days > diff and delta_t.days < 0:
                sought_date = dat
                diff = delta_t.days
        return(sought_date, date_dict[sought_date])


def compute_time():
    current_date = date.today()
    east_end_check =  current_date - date.fromisoformat(EASTER_END)
    if east_end_check.days > 0:
        weeks, days = divmod(east_end_check.days, 7)
        return ("Lv " + str(weeks + 2))
    east_start_check = current_date - date.fromisofformat(EASTER_START)
    if east_start_check.days > 0 and east_end_check.days < 0:
        return ("Självstudier")
    else:
        dat, typ = read_date_period()
        if typ == "exam_period":
            return ("Tentaperiod")
        else:
            delta_t = current_date - date.fromisoformat(dat)
            weeks, days = divmod(delta_t.days, 7)
            return ("LV " + str(weeks))

if __name__ == '__main__':
    print(compute_time())
