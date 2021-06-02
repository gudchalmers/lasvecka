from datetime import date, timedelta
import json

EASTER_START = date.fromisoformat("2021-04-01")
EASTER_END = date.fromisoformat("2021-04-10")
ORD_CONT = date.fromisoformat("2021-04-12")

# Find the appropiate date & period from data.txt (the output from the webscraper)
def read_date_period(curr_date):
    sought_date = ""
    diff = -1000
    with open('data.txt', 'r') as data_file:
        date_dict = eval(data_file.read())
        for dat, typ in date_dict.items():
            delta_t = date.fromisoformat(dat) - curr_date
            if delta_t.days == 0:
                return (dat, typ)
            elif delta_t.days > diff and delta_t.days < 0:
                sought_date = dat
                diff = delta_t.days
        return(sought_date, date_dict[sought_date])




def handle_easter(easter_start_diff, easter_end_diff):
    # Checks if it's easter
    if easter_start_diff.days >= 0 and easter_end_diff.days <= 0:
        return("Självstudier")
    # Add offset, will go up to Lv 8 until regular exam period
    elif easter_end_diff.days > 0:
        weeks, _ = divmod(easter_end_diff.days, 7)
        return ("Lv " + str(weeks + 2))
    


# Computes and determines the week of the study period, or returns Självstudier/Tentavecka if it's Easter or
# exam period.
def compute_time():
    current_date = date.fromisoformat("2021-04-28")
    # Calculates diffs for easter handling
    easter_end_check =  current_date - ORD_CONT
    easter_start_check = current_date - EASTER_START
    dat, typ = read_date_period(current_date)
    print(dat, typ)
    # Is it exam period? Also check for final exam period
    if typ == "exam_period":
        print(type(dat))
        delta_t = current_date - date.fromisoformat(dat)
        if delta_t.days > 7:
            return "Självstudier"
        else:
            return "Tentavecka"
    # Is it easter or after easter? Call handle_easter
    if easter_end_check.days >= 0 or easter_start_check.days >= 0:
        return (handle_easter(easter_start_check, easter_end_check))
    else:
        # Regular time handling
        delta_t = current_date - date.fromisoformat(dat)
        weeks, _ = divmod(delta_t.days, 7)
        if weeks > 8:
            return ("Självstudier")
        else:
            return ("LV " + str(weeks))

# For testing purposes
if __name__ == '__main__':
    print(compute_time())
